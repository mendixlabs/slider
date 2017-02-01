import { ShallowWrapper, shallow } from "enzyme";
import { DOM, createElement } from "react";

import * as RcSlider from "rc-slider";

import { Slider as SliderComponent, SliderProps } from "../Slider";

import { Alert } from "../Alert";

describe("Slider", () => {

    it("renders the structure", () => {
        //
    });

    describe("shows an error when the", () => {
        it("maximum value is not set", () => {
            //
        });

        it("minimum value is not set", () => {
            //
        });

        it("minimum value is greater than or equal to the maximum value", () => {
            //
        });
    });

    describe("with a value", () => {
        it("renders a slider with the given value", () => {
            //
        });

        it("that is undefined renders a slider with the calculated default value", () => {
            //
        });

        it("greater than the maximum value shows an errors", () => {
            //
        });

        it("less than minimum value shows an error", () => {
            //
        });
    });

    describe("with the step value specified shows an error", () => {
        it("when the step value is equal to 0", () => {
            //
        });

        it("when the step value is less than 0", () => {
            //
        });

        it("when the step value does not evenly divide (maximum - minimum)", () => {
            //
        });
    });

    describe("with the marker value", () => {
        it("less than 2 renders no markers", () => {
            //
        });

        it("greater than 2 renders markers on the slider", () => {
            //
        });
    });

    describe("with a tooltip", () => {
        it("renders a tooltip title with the correct text", () => {
            //
        });

        it("renders a tooltip with '--' when no slider value is specified", () => {
            //
        });

        it("renders no tooltip title when value is empty", () => {
            //
        });

        it("with a tooltipText template renders a tooltip with the substituted value", () => {
            //
        });
    });
});
