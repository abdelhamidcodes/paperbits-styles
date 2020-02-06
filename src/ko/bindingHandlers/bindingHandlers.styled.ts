import * as ko from "knockout";
import { StyleModel } from "@paperbits/common/styles";


export class StyledBindingHandler {
    constructor() {
        ko.bindingHandlers["styled"] = {
            update: async (element: HTMLElement, valueAccessor) => {
                const styleModel: StyleModel = ko.unwrap(valueAccessor());

                if (!styleModel) {
                    return;
                }

                if (styleModel.styleManager) {
                    styleModel.styleManager.setStyleSheet(styleModel.styleSheet);
                }

                ko.applyBindingsToNode(element, { css: styleModel.classNames }, null);

                ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                    if (styleModel.styleManager) {
                        styleModel.styleManager.removeStyleSheet(styleModel.key);
                    }
                });
            }
        };

        ko.bindingHandlers["styledInPlace"] = {
            update: async (element: HTMLElement, valueAccessor) => {
                const styleModel: StyleModel = ko.unwrap(valueAccessor());
        
                if (!styleModel) {
                    return;
                }
        
                const cssObservable = ko.observable();
        
                let styleElement = element.ownerDocument.getElementById(styleModel.key);
        
                if (styleModel.css) {
                    if (!styleElement) {
                        styleElement = element.ownerDocument.createElement("style");
                        styleElement.id = styleModel.key;
                        element.ownerDocument.head.appendChild(styleElement);
                    }
        
                    styleElement.innerHTML = styleModel.css;
                }
                else if (styleElement) {
                    styleElement.remove();
                }
        
                cssObservable(styleModel.classNames);
        
                ko.applyBindingsToNode(element, { css: cssObservable }, null);
            }
        };
    }
}