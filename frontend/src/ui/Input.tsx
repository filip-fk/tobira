import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiCopy } from "react-icons/fi";
import { focusStyle } from ".";
import { Button } from "./Button";
import { WithTooltip } from "./Floating";


const style = (error: boolean) => ({
    borderRadius: 4,
    border: `1px solid ${error ? "var(--danger-color)" : "var(--grey80)"}`,
    ":focus-visible": { borderColor: "var(--accent-color)" },
    ...focusStyle({ offset: -1 }),
});

export type InputProps = React.ComponentPropsWithoutRef<"input"> & {
    error?: boolean;
};

/** A styled single-line text box */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ error = false, ...rest }, ref) => (
        <input
            ref={ref}
            css={{ padding: "4px 10px", ...style(error) }}
            {...rest}
        />
    ),
);

export type TextAreaProps = React.ComponentPropsWithoutRef<"textarea"> & {
    error?: boolean;
};

/** A styled multi-line text area */
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ error = false, ...rest }, ref) => (
        <textarea
            ref={ref}
            css={{
                width: "100%",
                height: 200,
                resize: "none",
                padding: "8px 10px",
                ...style(error),
            }}
            {...rest}
        />
    ),
);

export type SelectProps = React.ComponentPropsWithoutRef<"select"> & {
    error?: boolean;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ error = false, ...rest }, ref) => (
        <select
            ref={ref}
            css={{
                padding: "4px 10px",
                ...style(error),
            }}
            {...rest}
        />
    ),
);

type CopyableInputProps = JSX.IntrinsicElements["div"] & {
    value: string;
    multiline?: boolean;
};

export const CopyableInput: React.FC<CopyableInputProps> = ({
    value,
    multiline = false,
    ...rest
}) => {
    const { t } = useTranslation();

    const [wasCopied, setWasCopied] = useState(false);
    const copy = async () => {
        await navigator.clipboard.writeText(value);
        setWasCopied(true);
    };

    const buttonSize = 34;
    const sharedStyle = {
        ...style(false),
        width: "100%",
        height: "100%",
        padding: `4px ${buttonSize + 10}px 4px 10px`,
    };
    const inner = multiline
        ? <textarea disabled value={value} css={{
            ...sharedStyle,
            overflow: "hidden",
            resize: "none",
        }} />
        : <input disabled value={value} css={sharedStyle} />;

    return (
        <div css={{
            position: "relative",
            height: multiline ? 95 : 34,
            maxWidth: "100%",
        }} {...rest}>
            <div css={{ position: "absolute", top: 0, right: 0 }}>
                <WithTooltip tooltip={t("copy-to-clipboard")}>
                    <Button
                        aria-label={t("copy-to-clipboard")}
                        kind="happy"
                        onClick={copy}
                        css={{
                            borderTopLeftRadius: 0,
                            height: 34,
                            ...multiline
                                ? { borderBottomRightRadius: 0 }
                                : { borderBottomLeftRadius: 0 },
                        }}
                    >
                        {wasCopied ? <FiCheck /> : <FiCopy />}
                    </Button>
                </WithTooltip>
            </div>
            {inner}
        </div>
    );
};
