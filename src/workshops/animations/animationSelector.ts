import * as ko from "knockout";
import template from "./animationSelector.html";
import { Component, Param, Event, OnMounted } from "@paperbits/common/ko/decorators";
import { StyleService } from "../../styleService";
import { AnimationContract } from "../../contracts/animationContract";


@Component({
    selector: "animation-selector",
    template: template
})
export class AnimationSelector {
    @Param()
    public readonly selectedAnimation: ko.Observable<AnimationContract>;

    @Event()
    public readonly onSelect: (animation: AnimationContract) => void;

    public animations: ko.ObservableArray<AnimationContract>;

    constructor(private readonly styleService: StyleService) {
        this.animations = ko.observableArray();
        this.selectedAnimation = ko.observable();
    }

    @OnMounted()
    public async loadAnimations(): Promise<void> {
        const animations = await this.styleService.getAnimations();
        const noAnimationOption = animations.find(x => x.key == "animations/none");

        if (!noAnimationOption) {
            animations.unshift(<any>{ "displayName": "No animation", "key": "animations/none" });
        }

        this.animations(animations);
    }

    public selectAnimation(animation: AnimationContract): void {
        if (this.selectedAnimation) {
            this.selectedAnimation(animation);
        }

        if (this.onSelect) {
            this.onSelect(animation);
        }
    }

    public clearAnimations(): void {
        if (this.selectedAnimation) {
            this.selectedAnimation(null);
        }

        if (this.onSelect) {
            this.onSelect(null);
        }
    }
}