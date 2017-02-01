import { ShallowWrapper, shallow } from "enzyme";
import { DOM, createElement } from "react";

import * as RcSlider from "rc-slider";

import { Slider as SliderComponent, SliderProps } from "../Slider";

import { Alert } from "../Alert";

describe("Slider", () => {
    let sliderProps: SliderProps;
    let slider: ShallowWrapper<SliderProps, any>;
    beforeEach(() => {
        sliderProps = {
            disabled: false,
            maxValue: 100,
            minValue: 0,
            noOfMarkers: 0,
            stepValue: 1,
            tooltipText: "{1}",
            value: 20
        };
    });
    const renderSlider = (props: SliderProps) => shallow(createElement(SliderComponent, props));

    it("renders the structure", () => {
        slider = renderSlider(sliderProps);

        expect(slider).toBeElement(
            DOM.div({ className: "widget-slider" },
                createElement(RcSlider, {
                    disabled: false,
                    included: false,
                    max: 100,
                    min: 0,
                    step: 1,
                    tipFormatter: jasmine.any(Function) as any,
                    value: 20,
                    vertical: false
                })
            )
        );
    });

    describe("shows an error when the", () => {
        it("maximum value is not set", () => {
            sliderProps.maxValue = null;
            slider = renderSlider(sliderProps);
            const alert = slider.find(Alert);

            expect(alert.props().message).toBe("Maximum value is required");
        });

        it("minimum value is not set", () => {
            sliderProps.minValue = null;
            slider = renderSlider(sliderProps);
            const alert = slider.find(Alert);

            expect(alert.props().message).toBe("Minimum value is required");
        });

        it("minimum value is greater than or equal to the maximum value", () => {
            sliderProps.minValue = 50;
            sliderProps.maxValue = 30;
            slider = renderSlider(sliderProps);
            const alert = slider.find(Alert);

            expect(alert.props().message).toBe("Minimum value 50 should be less than the maximum value 30");
        });
    });

    describe("with a value", () => {
        it("renders a slider with the given value", () => {
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().value).toBe(sliderProps.value);
        });

        it("that is undefined renders a slider with the calculated default value", () => {
            sliderProps.value = undefined;
            slider = renderSlider(sliderProps);
            const RcSliderComponent = slider.find(RcSlider);

            expect(RcSliderComponent.props().value).toBe((sliderProps.maxValue - sliderProps.minValue) / 2);
        });

        it("greater than the maximum value shows an errors", () => {
            sliderProps.value = 150;
            slider = renderSlider(sliderProps);
            const alert = slider.find(Alert);

            expect(alert.props().message).toBe("Value 150 should be less than the maximum 100");
        });

        it("less than minimum value shows an error", () => {
            sliderProps.value = -10;
            slider = renderSlider(sliderProps);
            const alert = slider.find(Alert);

            expect(alert.props().message).toBe("Value -10 should be greater than the minimum 0");
        });
    });

    describe("with the step value specified shows an error", () => {
        it("when the step value is equal to 0", () => {
            sliderProps.stepValue = 0;
            slider = renderSlider(sliderProps);
            const alert = slider.find(Alert);

            expect(alert.props().message).toBe("Step value 0 should be greater than 0");
        });

        it("when the step value is less than 0", () => {
            sliderProps.stepValue = -10;
            slider = renderSlider(sliderProps);
            const alert = slider.find(Alert);

            expect(alert.props().message).toBe("Step value -10 should be greater than 0");
        });

        it("when the step value does not evenly divide (maximum - minimum)", () => {
            sliderProps.stepValue = 6;
            slider = renderSlider(sliderProps);
            const alert = slider.find(Alert);

            expect(alert.props().message).toBe(`Step value is invalid, max - min (100 - 0) 
            should be evenly divisible by the step value 6`);
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
            sliderProps.value = undefined;
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
