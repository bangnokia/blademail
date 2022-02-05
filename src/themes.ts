import { ColorScheme, colors } from "@vechaiui/react";
export const bee: ColorScheme = {
    id: "bee",
    type: "light",
    colors: {
        bg: { base: colors.warmGray["100"], fill: colors.warmGray["100"] },
        text: { foreground: colors.warmGray["900"], muted: colors.warmGray["700"] },
        primary: colors.amber,
        neutral: colors.warmGray,
        danger: colors.red,
    },
};
