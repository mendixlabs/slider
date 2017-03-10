import { Component, createElement } from "react";

import { Slider } from "./Slider";

export interface SliderContainerProps {
    contextObject: mendix.lib.MxObject;
    valueAttribute: string;
    maximumAttribute: string;
    minimumAttribute: string;
    onChangeMicroflow: string;
    stepValue: number;
    stepAttribute: string;
    noOfMarkers: number;
    tooltipText: string;
    decimalPlaces: number;
    readOnly: boolean;
}

interface SliderContainerState {
    maximumValue?: number;
    minimumValue?: number;
    value?: number;
    stepValue?: number;
}

export class SliderContainer extends Component<SliderContainerProps, SliderContainerState> {
    private subscriptionHandles: number[];

    constructor(props: SliderContainerProps) {
        super(props);

        this.state = {
            maximumValue: this.getAttributeValue(props.contextObject, props.maximumAttribute),
            minimumValue: this.getAttributeValue(props.contextObject, props.minimumAttribute),
            stepValue: this.getAttributeValue(props.contextObject, props.stepAttribute, props.stepValue),
            value: this.getAttributeValue(props.contextObject, props.valueAttribute)
        };
        this.subscriptionHandles = [];
        this.resetSubscriptions(props.contextObject);
        this.handleAction = this.handleAction.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    render() {
        const disabled = !this.props.contextObject
            || this.props.readOnly
            || !!(this.props.stepAttribute && this.props.contextObject.isReadonlyAttr(this.props.stepAttribute));

        const alertMessage = this.validateSettings() || this.validateValues();

        return createElement(Slider, {
            alertMessage,
            decimalPlaces: this.props.decimalPlaces,
            disabled,
            maxValue: this.state.maximumValue,
            minValue: this.state.minimumValue,
            noOfMarkers: this.props.noOfMarkers,
            onChange: this.handleAction,
            onUpdate: this.onUpdate,
            stepValue: this.state.stepValue,
            tooltipText: this.props.tooltipText,
            value: this.state.value
        });
    }

    componentWillReceiveProps(newProps: SliderContainerProps) {
        this.resetSubscriptions(newProps.contextObject);
        this.updateValues(newProps.contextObject);
    }

    private getAttributeValue(
        contextObject: mendix.lib.MxObject,
        attributeName: string,
        defaultValue?: number): number | undefined {
        if (contextObject && attributeName) {
            if (contextObject.get(attributeName)) {
                return parseFloat(contextObject.get(attributeName) as string);
            }
        }

        return defaultValue;
    }

    private updateValues(contextObject: mendix.lib.MxObject) {
        this.setState({
            maximumValue: this.getAttributeValue(contextObject, this.props.maximumAttribute),
            minimumValue: this.getAttributeValue(contextObject, this.props.minimumAttribute),
            stepValue: this.getAttributeValue(contextObject, this.props.stepAttribute, this.props.stepValue),
            value: this.getAttributeValue(contextObject, this.props.valueAttribute)
        });
    }

    private onUpdate(value: number) {
        const { contextObject, valueAttribute } = this.props;
        const { maximumValue } = this.state;
        if (value || value === 0) {
            if ((maximumValue || maximumValue === 0) && (value > maximumValue)) {
                contextObject.set(valueAttribute, maximumValue);
            } else {
                contextObject.set(valueAttribute, value);
            }
        }
    }

    private handleAction(value: number) {
        if (value || value === 0) {
            this.executeMicroflow(this.props.onChangeMicroflow, this.props.contextObject.getGuid());
        }
    }

    private executeMicroflow(actionname: string, guid: string) {
        if (actionname) {
            window.mx.ui.action(actionname, {
                error: (error) => window.mx.ui.error(
                    `An error occurred while executing microflow: ${actionname}: ${error.message}`
                ),
                params: {
                    applyto: "selection",
                    guids: [ guid ]
                }
            });
        }
    }

    private resetSubscriptions(contextObject: mendix.lib.MxObject) {
        this.unSubscribe();

        if (contextObject) {
            this.subscriptionHandles.push(window.mx.data.subscribe({
                callback: () => this.updateValues(contextObject),
                guid: contextObject.getGuid()
            }));
            [
                this.props.valueAttribute,
                this.props.maximumAttribute,
                this.props.minimumAttribute,
                this.props.stepAttribute
            ].forEach((attr) =>
                this.subscriptionHandles.push(window.mx.data.subscribe({
                    attr,
                    callback: () => this.updateValues(contextObject),
                    guid: contextObject.getGuid()
                }))
                );
        }
    }

    private unSubscribe() {
        this.subscriptionHandles.forEach((handle) => window.mx.data.unsubscribe(handle));
    }

    private validateSettings(): string {
        const message: string[] = [];
        const { minimumValue, maximumValue, stepValue } = this.state;
        const validMax = typeof maximumValue === "number";
        const validMin = typeof minimumValue === "number";
        if (!validMax) {
            message.push("Maximum value is required");
        }
        if (!validMin) {
            message.push("Minimum value is required");
        }
        if (typeof maximumValue === "number" && typeof minimumValue === "number") {
            if (validMin && validMax && (minimumValue >= maximumValue)) {
                message.push(`Minimum value ${minimumValue} should be less than the maximum value ${maximumValue}`);
            }
            if (!stepValue || stepValue <= 0) {
                message.push(`Step value ${stepValue} should be greater than 0`);
            } else if (validMax && validMin && (maximumValue - minimumValue) % stepValue > 0) {
                message.push(`Step value is invalid, max - min (${maximumValue} - ${minimumValue}) 
            should be evenly divisible by the step value ${stepValue}`);
            }
        }

        return message.join(", ");
    }

    private validateValues(): string {
        const message: string[] = [];
        const { minimumValue, maximumValue, value } = this.state;
        if (typeof minimumValue === "number" && typeof maximumValue === "number" && typeof value === "number") {
            if (value > maximumValue) {
                message.push(`Value ${value} should be less than the maximum ${maximumValue}`);
            }
            if (value < minimumValue) {
                message.push(`Value ${value} should be greater than the minimum ${minimumValue}`);
            }
        }

        return message.join(", ");
    }
}
