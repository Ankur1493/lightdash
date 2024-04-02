import {
    getAxisName,
    getDateGroupLabel,
    getItemLabelWithoutTableName,
    isNumericItem,
    type ItemsMap,
} from '@lightdash/common';
import {
    Checkbox,
    Group,
    NumberInput,
    SegmentedControl,
    Stack,
    TextInput,
} from '@mantine/core';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { type FC } from 'react';
import MantineIcon from '../../../common/MantineIcon';
import { isCartesianVisualizationConfig } from '../../../LightdashVisualization/VisualizationConfigCartesian';
import { useVisualizationContext } from '../../../LightdashVisualization/VisualizationProvider';
import { Config } from '../common/Config';
import { AxisMinMax } from './AxisMinMax';

type Props = {
    itemsMap: ItemsMap | undefined;
};

export const Axes: FC<Props> = ({ itemsMap }) => {
    const { visualizationConfig } = useVisualizationContext();

    if (!isCartesianVisualizationConfig(visualizationConfig)) return null;

    const {
        dirtyLayout,
        dirtyEchartsConfig,
        setXAxisName,
        setYAxisName,
        setYMinValue,
        setYMaxValue,
        setXMinValue,
        setXMaxValue,
        setShowGridX,
        setShowGridY,
        setInverseX,
        setXAxisLabelRotation,
    } = visualizationConfig.chartConfig;

    const xAxisField =
        itemsMap && dirtyLayout?.xField
            ? itemsMap[dirtyLayout?.xField]
            : undefined;

    const selectedAxisInSeries = Array.from(
        new Set(
            dirtyEchartsConfig?.series?.map(({ yAxisIndex }) => yAxisIndex),
        ),
    );
    const isAxisTheSameForAllSeries: boolean =
        selectedAxisInSeries.length === 1;
    const selectedAxisIndex = selectedAxisInSeries[0] || 0;

    const [showFirstAxisRange, showSecondAxisRange] = (
        dirtyEchartsConfig?.series || []
    ).reduce<[boolean, boolean]>(
        (acc, series) => {
            if (!itemsMap) return acc;
            const seriesField = itemsMap[series.encode.yRef.field];
            if (isNumericItem(seriesField)) {
                acc[series.yAxisIndex || 0] = true;
            }
            return acc;
        },
        [false, false],
    );

    return (
        <Stack>
            <Config>
                <Config.Group>
                    <Config.Label>{`${
                        dirtyLayout?.flipAxes ? 'Y' : 'X'
                    }-axis label`}</Config.Label>
                    <TextInput
                        placeholder="Enter axis label"
                        defaultValue={
                            dirtyEchartsConfig?.xAxis?.[0]?.name ||
                            (xAxisField &&
                                (getDateGroupLabel(xAxisField) ||
                                    getItemLabelWithoutTableName(xAxisField)))
                        }
                        onBlur={(e) => setXAxisName(e.currentTarget.value)}
                    />

                    {isNumericItem(xAxisField) && (
                        <AxisMinMax
                            label={`Auto ${
                                dirtyLayout?.flipAxes ? 'y' : 'x'
                            }-axis range`}
                            min={dirtyEchartsConfig?.xAxis?.[0]?.min}
                            max={dirtyEchartsConfig?.xAxis?.[0]?.max}
                            setMin={(newValue) => setXMinValue(0, newValue)}
                            setMax={(newValue) => setXMaxValue(0, newValue)}
                        />
                    )}
                    <Group spacing="xs">
                        <Group spacing="xs">
                            <Config.SubLabel>Sort</Config.SubLabel>
                            <SegmentedControl
                                defaultValue={
                                    dirtyEchartsConfig?.xAxis?.[0]?.inverse
                                        ? 'descending'
                                        : 'ascending'
                                }
                                data={[
                                    {
                                        value: 'ascending',
                                        label: (
                                            <MantineIcon
                                                icon={IconSortAscending}
                                            />
                                        ),
                                    },
                                    {
                                        value: 'descending',
                                        label: (
                                            <MantineIcon
                                                icon={IconSortDescending}
                                            />
                                        ),
                                    },
                                ]}
                                onChange={(value) => {
                                    setInverseX(value === 'descending');
                                }}
                            />
                        </Group>
                        {!dirtyLayout?.flipAxes && (
                            <Group noWrap spacing="xs" align="baseline">
                                <Config.SubLabel>Rotation</Config.SubLabel>
                                <NumberInput
                                    type="number"
                                    defaultValue={
                                        dirtyEchartsConfig?.xAxis?.[0].rotate ||
                                        0
                                    }
                                    min={0}
                                    max={90}
                                    step={15}
                                    maw={54}
                                    rightSection="°"
                                    onChange={(value) => {
                                        setXAxisLabelRotation(Number(value));
                                    }}
                                />
                            </Group>
                        )}
                    </Group>
                </Config.Group>
            </Config>

            <Config>
                <Config.Group>
                    <Config.Label>{`${
                        dirtyLayout?.flipAxes ? 'X' : 'Y'
                    }-axis label (${
                        dirtyLayout?.flipAxes ? 'bottom' : 'left'
                    })`}</Config.Label>

                    <TextInput
                        placeholder="Enter axis label"
                        defaultValue={
                            dirtyEchartsConfig?.yAxis?.[0]?.name ||
                            getAxisName({
                                isAxisTheSameForAllSeries,
                                selectedAxisIndex,
                                axisReference: 'yRef',
                                axisIndex: 0,
                                series: dirtyEchartsConfig?.series,
                                itemsMap,
                            })
                        }
                        onBlur={(e) => setYAxisName(0, e.currentTarget.value)}
                    />
                    {showFirstAxisRange && (
                        <AxisMinMax
                            label={`Auto ${
                                dirtyLayout?.flipAxes ? 'x' : 'y'
                            }-axis range`}
                            min={dirtyEchartsConfig?.yAxis?.[0]?.min}
                            max={dirtyEchartsConfig?.yAxis?.[0]?.max}
                            setMin={(newValue) => setYMinValue(0, newValue)}
                            setMax={(newValue) => setYMaxValue(0, newValue)}
                        />
                    )}
                </Config.Group>
            </Config>

            <Config>
                <Config.Group>
                    <Config.Label>{`${
                        dirtyLayout?.flipAxes ? 'X' : 'Y'
                    }-axis label (${
                        dirtyLayout?.flipAxes ? 'top' : 'right'
                    })`}</Config.Label>

                    <TextInput
                        placeholder="Enter axis label"
                        defaultValue={
                            dirtyEchartsConfig?.yAxis?.[1]?.name ||
                            getAxisName({
                                isAxisTheSameForAllSeries,
                                selectedAxisIndex,
                                axisReference: 'yRef',
                                axisIndex: 1,
                                series: dirtyEchartsConfig?.series,
                                itemsMap,
                            })
                        }
                        onBlur={(e) => setYAxisName(1, e.currentTarget.value)}
                    />

                    {showSecondAxisRange && (
                        <AxisMinMax
                            label={`Auto ${
                                dirtyLayout?.flipAxes ? 'x' : 'y'
                            }-axis range`}
                            min={dirtyEchartsConfig?.yAxis?.[1]?.min}
                            max={dirtyEchartsConfig?.yAxis?.[1]?.max}
                            setMin={(newValue) => setYMinValue(1, newValue)}
                            setMax={(newValue) => setYMaxValue(1, newValue)}
                        />
                    )}
                </Config.Group>
            </Config>

            <Config>
                <Config.Group>
                    <Config.Label>Show grid</Config.Label>

                    <Stack spacing="xs">
                        <Checkbox
                            label={`${dirtyLayout?.flipAxes ? 'Y' : 'X'}-axis`}
                            checked={!!dirtyLayout?.showGridX}
                            onChange={() => {
                                setShowGridX(!dirtyLayout?.showGridX);
                            }}
                        />

                        <Checkbox
                            label={`${dirtyLayout?.flipAxes ? 'X' : 'Y'}-axis`}
                            checked={
                                dirtyLayout?.showGridY !== undefined
                                    ? dirtyLayout?.showGridY
                                    : true
                            }
                            onChange={() => {
                                setShowGridY(
                                    dirtyLayout?.showGridY !== undefined
                                        ? !dirtyLayout?.showGridY
                                        : false,
                                );
                            }}
                        />
                    </Stack>
                </Config.Group>
            </Config>
        </Stack>
    );
};