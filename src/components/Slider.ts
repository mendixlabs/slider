import { Component, createElement, DOM, ReactNode } from "react";

import * as classNames from "classnames";
import * as rcSlider from "rc-slider";
import * as tooltip from "rc-tooltip";

import { Alert } from "./Alert";

import "rc-slider/dist/rc-slider.css";
import "../ui/Slider.css";

interface Settings {
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
}

export class Slider extends Component<SliderProps, {}> {
    static defaultProps: SliderProps = {
        disabled: false,
        value: 0
    };

    constructor(props: SliderProps) {
        super(props);
    }

    render() {
        const { alertMessage, tooltipText } = this.props;
        const included = true;

        return DOM.div({ className: classNames("widget-slider", { "has-error": !!alertMessage }) },
            createElement(rcSlider, {
                disabled: this.props.disabled,
                handle: tooltipText ? this.createTooltip({ text: tooltipText, value: this.props.value }) : undefined,
                included,
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

    private calculateMarks(): rcSlider.Marks {
        const marks: any = {};
        const { noOfMarkers, maxValue, minValue } = this.props;
        if ((noOfMarkers || noOfMarkers === 0) && (maxValue || maxValue === 0) && (minValue || minValue === 0)) {
            if (this.isValidMinMax() && noOfMarkers >= 2) {
                const interval = (maxValue - minValue) / (noOfMarkers - 1);
                for (let i = 0; i < noOfMarkers; i++) {
                    const value = parseFloat((minValue + (i * interval)).toFixed(this.props.decimalPlaces));
                    marks[value] = value;
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

    private createTooltip(tooltipProps: Settings): ((props: TooltipProps) => ReactNode) | undefined {
        return (props) => {
            const Handle = rcSlider.Handle;
            const sliderText = tooltipProps.value === null
                ? "--"
                : tooltipProps.text.replace(/\{1}/, props.value.toString());

            return (createElement(tooltip, {
                mouseLeaveDelay: 0,
                overlay: DOM.div(null, sliderText),
                placement: "top",
                prefixCls: "rc-slider-tooltip",
                trigger: [ "hover" ]
            }, createElement(Handle, { className: props.className, vertical: props.vertical, offset: props.offset })));
        }
    }
}
