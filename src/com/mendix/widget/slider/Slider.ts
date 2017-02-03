import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { Slider as SliderComponent } from "./components/Slider";

class Slider extends WidgetBase {
    // Properties from Mendix modeler
    valueAttribute: string;
    maxAttribute: string;
    minAttribute: string;
    onChangeMicroflow: string;
    stepValue: number;
    stepAttribute: string;
    noOfMarkers: number;
    tooltipText: string;
    decimalPlaces: number;

    private contextObject: mendix.lib.MxObject;

    postCreate() {
        this.handleAction = this.handleAction.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    update(contextObject: mendix.lib.MxObject, callback?: Function) {
        this.contextObject = contextObject;
        this.resetSubscriptions();
        this.updateRendering();

        if (callback) {
            callback();
        }
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }

    private updateRendering(validationMessage?: string) {
        const disabled = !this.contextObject
            || this.readOnly
            || !!(this.stepAttribute && this.contextObject.isReadonlyAttr(this.stepAttribute));
        render(createElement(SliderComponent, {
            decimalPlaces: this.decimalPlaces,
            disabled,
            hasError: !!validationMessage,
            maxValue: this.getAttributeValue(this.maxAttribute),
            minValue: this.getAttributeValue(this.minAttribute),
            noOfMarkers: this.noOfMarkers,
            onChange: this.handleAction,
            onUpdate: this.onUpdate,
            stepValue: this.getAttributeValue(this.stepAttribute, this.stepValue),
            tooltipText: this.tooltipText,
            value: this.getAttributeValue(this.valueAttribute),
            validationMessage
        }), this.domNode);
    }

    private getAttributeValue(attributeName: string, defaultValue?: number): number | undefined {
        if (this.contextObject && attributeName) {
            if (this.contextObject.get(attributeName) !== "") {
                return parseFloat(this.contextObject.get(attributeName) as string);
            }
        }

        return defaultValue;
    }

    private handleValidation(validations: mendix.lib.ObjectValidation[]) {
        const validationMessage = validations[0].getErrorReason(this.valueAttribute);
        if (validationMessage) {
            this.updateRendering(validationMessage);
        }
    }

    private onUpdate(value: number) {
        if (value || value === 0) {
            if (value > this.getAttributeValue(this.maxAttribute)) {
                this.contextObject.set(this.valueAttribute, this.getAttributeValue(this.maxAttribute));
            } else {
                this.contextObject.set(this.valueAttribute, value);
            }
        }
    }

    private handleAction(value: number) {
        if (value || value === 0) {
            this.executeMicroflow(this.onChangeMicroflow, [ this.contextObject.getGuid() ]);
        }
    }

    private executeMicroflow(actionname: string, guids: string[]) {
        if (actionname) {
            window.mx.ui.action(actionname, {
                error: (error) => this.updateRendering(`An error occurred while executing microflow: ${error.message}`),
                params: {
                    applyto: "selection",
                    guids
                }
            });
        }
    }

    private resetSubscriptions() {
        this.unsubscribeAll();

        if (this.contextObject) {
            this.subscribe({
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });

            this.subscribeAttributes([ this.valueAttribute, this.minAttribute, this.maxAttribute, this.stepAttribute ]);

            this.subscribe({
                callback: (validations) => this.handleValidation(validations),
                guid: this.contextObject.getGuid(),
                val: true
            });
        }
    }

    private subscribeAttributes(attributes: string[]) {
        attributes.forEach((attribute) =>
            this.subscribe({
                attr: attribute,
                callback: () => this.updateRendering(),
                guid: this.contextObject.getGuid()
            })
        );
    }
}

// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.slider.Slider", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const property in Source.prototype) {
        if (property !== "constructor" && Source.prototype.hasOwnProperty(property)) {
            result[property] = Source.prototype[property];
        }
    }
    return result;
}(Slider));
