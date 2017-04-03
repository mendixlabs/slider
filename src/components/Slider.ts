import { Component, createElement, DOM } from "react";

import * as classNames from "classnames";
import * as RcSlider from "rc-slider";

import { Alert } from "./Alert";

import "rc-slider/dist/rc-slider.css";

import "../ui/Slider.css";

export interface SliderProps {
    value?: number;
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

interface Marks {
    [key: number]: string | number | {
        style: HTMLStyleElement,
        label: string
    };
}

export class Slider extends Component<SliderProps, {}> {
    static defaultProps: SliderProps = {
        disabled: false,
        maxValue: 100,
        minValue: 0,
        noOfMarkers: 2,
        tooltipText: "{1}"
    };

    constructor(props: SliderProps) {
        super(props);

        this.getTooltipText = this.getTooltipText.bind(this);
    }

    render() {
        const { alertMessage } = this.props;
        const included = true;
        const pushable = false;
        const range = false;
        return DOM.div({ className: classNames("widget-slider", { "has-error": !!alertMessage }) },
            createElement(RcSlider, {
                disabled: this.props.disabled,
                included,
                marks: this.calculateMarks(),
                max: this.props.maxValue,
                min: this.props.minValue,
                onAfterChange: this.props.onChange,
                onChange: this.props.onUpdate,
                pushable,
                range,
                step: this.props.stepValue,
                tipFormatter: this.props.tooltipText ? this.getTooltipText : null,
                value: this.getValidValue()
            }),
            createElement(Alert, { message: alertMessage })
        );
    }

    private calculateMarks(): Marks {
        const marks: Marks = {};
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

    private getTooltipText(value: number): string {
        const textForUndefinedValue = "--";
        if (this.props.value === undefined) {
            return textForUndefinedValue;
        }

        return this.props.tooltipText ? this.props.tooltipText.replace(/\{1}/, value.toString()) : value.toString();
    }
}
