import { Component, DOM, createElement } from "react";

import * as classNames from "classnames";
import * as RcSlider from "rc-slider";

import "../ui/Slider.css";
import "rc-slider/dist/rc-slider.css";

import { Alert } from "./Alert";

export interface SliderProps {
    hasError?: boolean;
    value?: number;
    noOfMarkers?: number;
    maxValue?: number | null;
    minValue?: number | null;
    validationMessage?: string;
    onClick?: (value: number) => void;
    onChange?: (value: number) => void;
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
        const alertMessage = this.validateSettings(this.props)
            || this.validateValues(this.props) || this.props.validationMessage;

        return DOM.div({ className: classNames("widget-slider", { "has-error": !!alertMessage }) },
            createElement(RcSlider, {
                disabled: !!this.validateSettings(this.props) || this.props.disabled,
                included: true,
                marks: this.calculateMarks(this.props),
                max: this.props.maxValue,
                min: this.props.minValue,
                onAfterChange: this.props.onClick,
                onChange: this.props.onChange,
                pushable: false,
                range: false,
                step: this.props.stepValue ? this.props.stepValue : null,
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

    private validateSettings(props: SliderProps): string {
        const message: string[] = [];
        const validMax = typeof props.maxValue === "number";
        const validMin = typeof props.minValue === "number";
        if (!validMax) {
            message.push("Maximum value is required");
        }
        if (!validMin) {
            message.push("Minimum value is required");
        }
        if (validMin && validMax && (props.minValue >= props.maxValue)) {
            message.push(`Minimum value ${props.minValue} should be less than the maximum value ${props.maxValue}`);
        }
        if (!props.stepValue || props.stepValue <= 0) {
            message.push(`Step value ${props.stepValue} should be greater than 0`);
        } else if (validMax && validMin && (props.maxValue - props.minValue) % props.stepValue > 0) {
            message.push(`Step value is invalid, max - min (${props.maxValue} - ${props.minValue}) 
            should be evenly divisible by the step value ${props.stepValue}`);
        }

        return message.join(", ");
    }

    private validateValues(props: SliderProps): string {
        const message: string[] = [];
        if (props.value > props.maxValue) {
            message.push(`Value ${props.value} should be less than the maximum ${props.maxValue}`);
        }
        if (props.value < props.minValue) {
            message.push(`Value ${props.value} should be greater than the minimum ${props.minValue}`);
        }

        return message.join(", ");
    }

    private getTooltipText(value: number): string {
        if (this.props.value === undefined) {
            return "--";
        }

        return this.props.tooltipText ? this.props.tooltipText.replace(/\{1}/, value.toString()) : value.toString();
    }
}
