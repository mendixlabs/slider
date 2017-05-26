import { Component, createElement } from "react";
import { Slider, SliderProps } from "./components/Slider";
import SliderContainer, { SliderContainerProps } from "./components/SliderContainer";

import * as css from "./ui/Slider.scss";
import * as rcsliderCss from "rc-slider/dist/rc-slider.css";

// tslint:disable-next-line:class-name
export class preview extends Component<SliderContainerProps, {}> {
    private warnings: string;

    componentWillMount() {
        this.addPreviewStyle(css, "widget-slider-preview-style");
        this.addPreviewStyle(rcsliderCss, "widget-rcslider-preview-style");
    }

    render() {
        this.warnings = SliderContainer.validateSettings({
            maximumValue: 100,
            minimumValue: 0,
            stepValue: this.props.stepValue,
            value: 50
        });

        return createElement(Slider, this.transformProps(this.props));
    }

    private transformProps(props: SliderContainerProps): SliderProps {
        return {
            alertMessage: this.warnings,
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

    private addPreviewStyle(styleClass: string, styleId: string) {
        // This workaround is to load style in the preview temporary till mendix has a better solution
        const iFrame = document.getElementsByClassName("t-page-editor-iframe")[0] as HTMLIFrameElement;
        const iFrameDoc = iFrame.contentDocument;
        if (!iFrameDoc.getElementById(styleId)) {
            const styleTarget = iFrameDoc.head || iFrameDoc.getElementsByTagName("head")[0];
            const styleElement = document.createElement("style");
            styleElement.setAttribute("type", "text/css");
            styleElement.setAttribute("id", styleId);
            styleElement.appendChild(document.createTextNode(styleClass));
            styleTarget.appendChild(styleElement);
        }
    }
}
