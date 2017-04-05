import { shallow, ShallowWrapper } from "enzyme";
import { createElement, DOM } from "react";

import * as RcSlider from "rc-slider";
import { Alert } from "../Alert";

import { Slider, SliderProps } from "../Slider";

describe("Slider", () => {
    let sliderProps: SliderProps;
    let slider: ShallowWrapper<SliderProps, any>;
    const value = 20;
    const maxValue = 100;
    const minValue = 0;
    const stepValue = 1;
    const noOfMarkers = 0;
    beforeEach(() => {
        sliderProps = {
            disabled: false,
            maxValue,
            minValue,
            noOfMarkers,
            stepValue,
            tooltipText: "{1}",
            value
        };
    });
    const renderSlider = (props: SliderProps) => shallow(createElement(Slider, props));

    it("renders the structure", () => {
        slider = renderSlider(sliderProps);

        expect(slider).toBeElement(
            DOM.div({ className: "widget-slider" },
                createElement(RcSlider, {
                    disabled: false,
                    handle: jasmine.any(Function) as any,
                    included: true,
                    max: maxValue,
                    min: minValue,
                    step: stepValue,
                    value,
                    vertical: false
                }), createElement(Alert, { message: "" })
            )
        );
    });

    it("renders with a given value", () => {
        slider = renderSlider(sliderProps);
        const RcSliderComponent = slider.find(RcSlider);

        expect(RcSliderComponent.props().value).toBe(sliderProps.value);
    });

    it("renders with negative values", () => {
        sliderProps.value = -5;
        sliderProps.maxValue = 0;
        sliderProps.minValue = -10;
        slider = renderSlider(sliderProps);
        const RcSliderComponent = slider.find(RcSlider);

        expect(RcSliderComponent.props().value).toBe(sliderProps.value);
    });

    it("without a value renders with the calculated value", () => {
        sliderProps.value = null;
        slider = renderSlider(sliderProps);
        const RcSliderComponent = slider.find(RcSlider);

        expect(RcSliderComponent.props().value).toBe((maxValue - minValue) / 2);
    });

    it("with both invalid minimum and maximum values, renders with the calculated value", () => {
        sliderProps.maxValue = -10;
        sliderProps.value = null;
        slider = renderSlider(sliderProps);
        const RcSliderComponent = slider.find(RcSlider);

        expect(RcSliderComponent.props().value).toBe(0);
    });

    describe("with a value that is", () => {
        it("greater than the maximum value, assigns maximum value to value", () => {
            sliderProps.value = 150;
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().value).toBe(maxValue);
        });

        it("less than the minimum value, assigns minimum value to value", () => {
            sliderProps.value = -10;
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().value).toBe(minValue);
        });
    });

    describe("with the marker value that is", () => {
        it("less than 2, renders no markers on the slider", () => {
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().marks).toEqual({});
        });

        it("greater than 2 renders markers on the slider", () => {
            sliderProps.noOfMarkers = 5;
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().marks).toEqual({ 0: 0, 25: 25, 50: 50, 75: 75, 100: 100 });
        });
    });

    describe("with a tooltip", () => {
        it("renders a tooltip title with the correct text", () => {
            sliderProps.tooltipText = "Slider";
            slider = renderSlider(sliderProps);

            const sliderInstance = slider.instance() as any;
            spyOn(sliderInstance, "createTooltip").and.callThrough();
            slider.setProps({ tooltipText: sliderProps.tooltipText });

            expect(sliderInstance.createTooltip).toHaveBeenCalledWith({
                text: sliderProps.tooltipText,
                value: sliderProps.value
            });
        });

        it("renders a tooltip title with '--' when no slider value is specified", () => {
            sliderProps.value = null;
            slider = renderSlider(sliderProps);

            const sliderInstance = slider.instance() as any;
            spyOn(sliderInstance, "createTooltip").and.callThrough();
            slider.setProps({ tooltipText: sliderProps.tooltipText });

            expect(sliderInstance.createTooltip).toHaveBeenCalledWith({
                text: sliderProps.tooltipText,
                value: null
            });
        });
    });

    describe("without tooltipText value", () => {
        it("renders no tooltip", () => {
            sliderProps.tooltipText = "";
            slider = renderSlider(sliderProps);

            const sliderInstance = slider.instance() as any;
            spyOn(sliderInstance, "createTooltip");
            slider.setProps({ tooltipText: sliderProps.tooltipText });

            expect(sliderInstance.createTooltip).not.toHaveBeenCalled();
        });
    });
});
