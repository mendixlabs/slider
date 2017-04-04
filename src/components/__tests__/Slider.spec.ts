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
                    included: true,
                    max: maxValue,
                    min: minValue,
                    step: stepValue,
                    tipFormatter: jasmine.any(Function) as any,
                    value,
                    vertical: false
                }), createElement(Alert, { message: "" })
            )
        );
    });

    describe("with a value", () => {
        it("renders a slider with the given value", () => {
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().value).toBe(sliderProps.value);
        });

        it("that is undefined renders a slider with the calculated default value", () => {
            sliderProps.value = null;
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().value).toBe((maxValue - minValue) / 2);
        });
    });

    describe("with the marker value", () => {
        it("less than 2 renders no markers", () => {
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
            const RcSliderComponent = slider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.tooltipText)).toBe("Slider");
        });

        it("renders a tooltip with '--' when no slider value is specified", () => {
            sliderProps.value = null;
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.tooltipText)).toBe("--");
        });

        it("renders no tooltip title when value is empty", () => {
            sliderProps.tooltipText = "";
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().tipFormatter).toBeNull();
        });

        it("with a tooltipText template renders a tooltip with the substituted value", () => {
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect((RcSliderComponent.props() as any).tipFormatter(sliderProps.value)).toBe(`${sliderProps.value}`);
        });
    });
});
