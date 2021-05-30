/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface PoseViewer {
        "changeplaybackRate": (rate: number) => Promise<void>;
        /**
          * Allow editing the img
         */
        "edit": boolean;
        "fps": number;
        "nextFrameId": number;
        "paused": boolean;
        "playbackrate": number;
        "setVideo": (video: any) => Promise<void>;
        /**
          * Pose Img Source
         */
        "src": string;
    }
}
declare global {
    interface HTMLPoseViewerElement extends Components.PoseViewer, HTMLStencilElement {
    }
    var HTMLPoseViewerElement: {
        prototype: HTMLPoseViewerElement;
        new (): HTMLPoseViewerElement;
    };
    interface HTMLElementTagNameMap {
        "pose-viewer": HTMLPoseViewerElement;
    }
}
declare namespace LocalJSX {
    interface PoseViewer {
        /**
          * Allow editing the img
         */
        "edit"?: boolean;
        "fps"?: number;
        "nextFrameId"?: number;
        "paused"?: boolean;
        "playbackrate"?: number;
        /**
          * Pose Img Source
         */
        "src"?: string;
    }
    interface IntrinsicElements {
        "pose-viewer": PoseViewer;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "pose-viewer": LocalJSX.PoseViewer & JSXBase.HTMLAttributes<HTMLPoseViewerElement>;
        }
    }
}
