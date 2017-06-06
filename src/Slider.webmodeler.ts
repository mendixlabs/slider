import { Component, createElement } from "react";
import { Slider, SliderProps } from "./components/Slider";
import SliderContainer, { SliderContainerProps } from "./components/SliderContainer";

declare function require(name: string): string;

// tslint:disable-next-line:class-name
export class preview extends Component<SliderContainerProps, {}> {
    render() {
        const warnings = SliderContainer.validateSettings({
            maximumValue: 100,
            minimumValue: 0,
            stepValue: this.props.stepValue,
            value: 50
        });

        return createElement(Slider, this.transformProps(this.props, warnings));
    }

    private transformProps(props: SliderContainerProps, warnings: string): SliderProps {
        return {
            alertMessage: warnings,
            bootstrapStyle: props.bootstrapStyle,
            className: props.class,
            decimalPlaces: props.decimalPlaces,
            disabled: false,
            maxValue: 100,
            minValue: 0,
            noOfMarkers: props.noOfMarkers,
            stepValue: props.stepValue <= 0 ? 10 : props.stepValue,
            style: SliderContainer.parseStyle(props.style),
            tooltipText: props.tooltipText,
            value: 50
        };
    }
}

export function getPreviewCss() {
    return (
        require("./ui/Slider.scss") + require("rc-slider/dist/rc-slider.css")
    );
}
