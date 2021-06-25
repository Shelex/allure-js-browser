import {
    AttachmentOptions,
    Category,
    LinkType,
    Status,
    ContentType,
    LabelName
} from './model';
import { AllureTest } from './AllureTest';
import { ExecutableItemWrapper } from './ExecutableItemWrapper';
import { AllureRuntime } from './AllureRuntime';

export abstract class Allure {
    protected abstract get currentTest(): AllureTest; // test only
    protected abstract get currentExecutable(): ExecutableItemWrapper; // step or test

    protected constructor(protected runtime: AllureRuntime) {}

    public epic(epic: string): void {
        this.label(LabelName.EPIC, epic);
    }

    public feature(feature: string): void {
        this.label(LabelName.FEATURE, feature);
    }

    public story(story: string): void {
        this.label(LabelName.STORY, story);
    }

    public suite(name: string): void {
        this.label(LabelName.SUITE, name);
    }

    public parentSuite(name: string): void {
        this.label(LabelName.PARENT_SUITE, name);
    }

    public subSuite(name: string): void {
        this.label(LabelName.SUB_SUITE, name);
    }

    public label(name: string, value: string): void {
        this.currentTest.addLabel(name, value);
    }

    public parameter(name: string, value: string): void {
        this.currentExecutable.addParameter(name, value);
    }

    public link(url: string, name?: string, type?: string): void {
        this.currentTest.addLink(url, name, type);
    }

    public issue(name: string, url: string): void {
        this.link(url, name, LinkType.ISSUE);
    }

    public tms(name: string, url: string): void {
        this.link(url, name, LinkType.TMS);
    }

    public description(markdown: string): void {
        this.currentExecutable.description = markdown;
    }

    public descriptionHtml(html: string): void {
        this.currentExecutable.descriptionHtml = html;
    }

    public abstract attachment(
        name: string,
        content: Buffer | string,
        options: ContentType | string | AttachmentOptions
    ): void;

    public owner(owner: string): void {
        this.label(LabelName.OWNER, owner);
    }

    public severity(severity: string): void {
        this.label(LabelName.SEVERITY, severity);
    }

    public tag(tag: string): void {
        this.label(LabelName.TAG, tag);
    }

    public writeEnvironmentInfo(info: Record<string, string>): void {
        this.runtime.writeEnvironmentInfo(info);
    }

    public writeCategoriesDefinitions(categories: Category[]): void {
        this.runtime.writeCategoriesDefinitions(categories);
    }

    public abstract logStep(name: string, status?: Status): void;
    public abstract step<T>(
        name: string,
        body: (step: StepInterface) => unknown
    ): T;

    // below are compatibility functions

    /**
     * @deprecated Use step function
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public createStep(name: string, stepFunction: Function) {
        return (...args: unknown[]): unknown =>
            this.step(name, () => stepFunction.apply(this, args));
    }

    /**
     * @deprecated Use attachment function
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public createAttachment(
        name: string,
        // eslint-disable-next-line @typescript-eslint/ban-types
        content: Buffer | string | Function,
        type: ContentType
    ) {
        if (typeof content === 'function') {
            return (...args: unknown[]) => {
                this.attachment(name, content.apply(this, args), type);
            };
        } else {
            this.attachment(name, content, type);
        }
    }
}

export interface StepInterface {
    parameter(name: string, value: string): void;
    name(name: string): void;
}
