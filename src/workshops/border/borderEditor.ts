import * as ko from "knockout";
import template from "./borderEditor.html";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { BorderStyleContract } from "../../contracts/borderContract";
import { ColorContract } from "../../contracts";
import { StyleService } from "../..";

@Component({
    selector: "border-editor",
    template: template,
    injectable: "borderEditor"
})
export class BorderEditor {
    public borderLineWidth: ko.Observable<string | number>;
    public borderColor: ko.Observable<ColorContract>;
    public borderColorKey: ko.Observable<string>;
    public borderLineStyle: ko.Observable<string>;
    public borderLineStyles: ko.ObservableArray<any>;

    public readonly colors: ko.ObservableArray<ColorContract>;

    @Param()
    public readonly borderStyle: ko.Observable<BorderStyleContract>;

    @Event()
    public readonly onChange: (contract: BorderStyleContract) => void;

    

    constructor(private readonly styleService: StyleService) {
        this.borderColor = ko.observable<ColorContract>();
        this.borderColorKey = ko.observable();
        this.borderLineStyle = ko.observable();
        this.borderStyle = ko.observable();
        this.borderLineWidth = ko.observable();

        this.colors = ko.observableArray();

        this.borderLineStyles = ko.observableArray([
            { name: "Solid", value: "solid" },
            { name: "Dashed", value: "dashed" }
        ]);
    }

    @OnMounted()
    public async initialize(): Promise<void> {
        const style = this.borderStyle();

        this.borderLineWidth(1);
        this.borderLineStyle("solid");

        if (style) {
            this.borderLineWidth(style.width);
            this.borderLineStyle(style.style);
            this.borderColorKey(style.colorKey);
        }



        const themeContract = await this.styleService.getStyles();

        const colors = Object.keys(themeContract.colors).map((key) => {
            const colorContract = themeContract.colors[key];
            return colorContract;
        });

        this.colors(colors);



        this.borderLineWidth.subscribe(this.applyChanges);
        this.borderLineStyle.subscribe(this.applyChanges);
    }

    public selectColor(color: ColorContract): void {
        this.borderColorKey(color ? color.key : null);
        this.applyChanges();
    }

    public clearColor(): void {
        // if (this.selectedColor) {
        //     this.selectedColor(null);
        // }

        // if (this.onSelect) {
        //     this.onSelect(null);
        // }
    }

    private applyChanges(): void {
        const colorKey = this.borderColorKey();
        const borderLineStyle = this.borderLineStyle();
        const borderLineWidth = this.borderLineWidth();

        let borderStyle: BorderStyleContract;

        if (colorKey && borderLineStyle && borderLineWidth) {
            borderStyle = {
                width: borderLineWidth,
                style: borderLineStyle,
                colorKey: colorKey
            };
        }

        this.onChange(borderStyle);
    }
    
}