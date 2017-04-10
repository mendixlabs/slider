import { Component, createElement, DOM, ReactNode } from "react";

import * as classNames from "classnames";
import * as RCSlider from "rc-slider";
import * as Tooltip from "rc-tooltip";

import { Alert } from "./Alert";

import "rc-slider/dist/rc-slider.css";
import "../ui/Slider.css";

interface TooltipOptions {
    text: string;
    value: number | null;
}

interface TooltipProps {
    value: number;
    className: string;
    vertical: boolean;
    offset: number;
}

export interface SliderProps {
    value: number | null;
    noOfMarkers?: number;
    maxValue?: number;
    minValue?: number;
    alertMessage?: string;
    stepValue?: number;
    disabled: boolean;
    decimalPlaces?: number;
    onChange?: (value: number) => void;
    onUpdate?: (value: number) => void;
    tooltipText?: string | null;
    color?: string;
}

export class Slider extends Component<SliderProps, {}> {
    static defaultProps: SliderProps = {
        disabled: false,
        value: 0
    };

    render() {
        const { alertMessage, tooltipText } = this.props;

        return DOM.div(
            {
                className: classNames("widget-slider", `widget-slider-${this.props.color}`, {
                    "has-error": !!alertMessage
                })
            },
            createElement(RCSlider, {
                disabled: this.props.disabled,
                handle: tooltipText ? this.createTooltip({ text: tooltipText, value: this.props.value }) : undefined,
                included: true,
                marks: this.calculateMarks(),
                max: this.props.maxValue,
                min: this.props.minValue,
                onAfterChange: this.props.onChange,
                onChange: this.props.onUpdate,
                step: this.props.stepValue,
                value: this.getValidValue()
            }),
            createElement(Alert, { message: alertMessage })
        );
    }

    private calculateMarks(): RCSlider.Marks {
        const marks: RCSlider.Marks = {};
        const { noOfMarkers, maxValue, minValue } = this.props;
        if ((noOfMarkers || noOfMarkers === 0) && (maxValue || maxValue === 0) && (minValue || minValue === 0)) {
            if (this.isValidMinMax() && noOfMarkers >= 2) {
                const interval = (maxValue - minValue) / (noOfMarkers - 1);
                for (let i = 0; i < noOfMarkers; i++) {
                    const value = parseFloat((minValue + (i * interval)).toFixed(this.props.decimalPlaces));
                    marks[value] = value as any;
                }
            }
        }

        return marks;
    }

    private isValidMinMax(): boolean {
        const { maxValue, minValue } = this.props;
        return typeof maxValue === "number" && typeof minValue === "number" && minValue < maxValue;
    }

    private getValidValue(): number | undefined {
        const { minValue, maxValue, value } = this.props;
        if ((minValue || minValue === 0) && (maxValue || maxValue === 0)) {
            if (value || value === 0) {
                if (value > maxValue) {
                    return maxValue;
                }
                if (value < minValue) {
                    return minValue;
                }
                return value;
            }
            if (this.isValidMinMax()) {
                return (minValue + (maxValue - minValue) / 2);
            }
        }

        return 0;
    }

    private createTooltip(tooltipProps: TooltipOptions): ((props: TooltipProps) => ReactNode) | undefined {
        return (props) => {
            const sliderText = tooltipProps.value === null
                ? "--"
                : tooltipProps.text.replace(/\{1}/, props.value.toString());

            return createElement(Tooltip,
                {
                    mouseLeaveDelay: 0,
                    overlay: DOM.div(null, sliderText),
                    placement: "top",
                    prefixCls: "rc-slider-tooltip",
                    trigger: [ "hover", "click", "focus" ]
                },
                createElement(RCSlider.Handle, {
                    className: props.className,
                    offset: props.offset,
                    vertical: props.vertical
                }
            ));
        };
    }
}
