import { useTranslation } from "react-i18next";

import { Card } from "../ui/Card";
import { FiTruck } from "react-icons/fi";
import { keyframes } from "@emotion/react";

export const WaitingPage: React.FC<{ type: "video" | "series" }> = ({ type }) => {
    const { t } = useTranslation();

    return (
        <div css={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
            <div><MovingTruck /></div>
            <Card kind="info">{t(`${type}.not-ready.title`)}</Card>
            <div css={{ maxWidth: 700 }}>{t(`${type}.not-ready.text`)}</div>
        </div>
    );
};

export const MovingTruck: React.FC = () => (
    <FiTruck css={{
        fontSize: 40,
        animation: `500ms steps(2, end) infinite none ${keyframes({
            "0%": { transform: "translateY(5px)" },
            "100%": { transform: "none" },
        })}`,
    }}/>
);
