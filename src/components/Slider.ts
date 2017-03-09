import { Component, createElement, DOM } from "react";

import * as classNames from "classnames";
import * as RcSlider from "rc-slider";

import "rc-slider/dist/rc-slider.css";
import "../ui/Slider.css";

import { Alert } from "./Alert";

export interface SliderProps {
    hasError?: boolean;
    value?: number;
    noOfMarkers?: number;
    maxValue?: number | null;
    minValue?: number | null;
    alertMessage?: string;
    onChange?: (value: number) => void;
    onUpdate?: (value: number) => void;
    stepValue?: number;
    tooltipText?: string | null;
    disabled: boolean;
    decimalPlaces?: number;
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
        return DOM.div({ className: classNames("widget-slider", { "has-error": !!alertMessage }) },
            createElement(RcSlider, {
                disabled: !!alertMessage || this.props.disabled,
                included: true,
                marks: this.calculateMarks(this.props),
                max: this.props.maxValue,
                min: this.props.minValue,
                onAfterChange: this.props.onChange,
                onChange: this.props.onUpdate,
                pushable: false,
                range: false,
                step: this.props.stepValue,
                tipFormatter: this.props.tooltipText ? this.getTooltipText : null,
                value: typeof this.props.value === "number" ? this.props.value : this.calculateDefaultValue(this.props)
            }),
            alertMessage && !this.props.disabled ? createElement(Alert, { message: alertMessage }) : null
        );
    }

    private calculateMarks(props: SliderProps): Marks {
        const marks: Marks = {};
        if (this.isValidMinMax(props) && props.noOfMarkers >= 2) {
            const interval = (props.maxValue - props.minValue) / (props.noOfMarkers - 1);
            for (let i = 0; i < props.noOfMarkers; i++) {
                const value = parseFloat((props.minValue + (i * interval)).toFixed(props.decimalPlaces));
                marks[value] = value;
            }
        }
        return marks;
    }

    private isValidMinMax(props: SliderProps): boolean {
        const { maxValue, minValue } = props;
        return typeof maxValue === "number" && typeof minValue === "number" && minValue < maxValue;
    }

    private calculateDefaultValue(props: SliderProps): number {
        return this.isValidMinMax(props) ? props.minValue + (props.maxValue - props.minValue) / 2 : 0;
    }

    private getTooltipText(value: number): string {
        if (this.props.value === undefined) {
            return "--";
        }

        return this.props.tooltipText ? this.props.tooltipText.replace(/\{1}/, value.toString()) : value.toString();
    }
}
