import { createTheme } from "@mui/material/styles";
import Icon from "@mui/material/Icon";

declare module "@mui/material/Button" {
    interface ButtonPropsVariantOverrides {
        bold: true;
    }
}

const CustomTheme = createTheme({
    components: {
        MuiButton: {
            variants: [{
                props: {
                    variant: "bold"
                },
                style: {
                    fontWeight: "bold",
                    border: `4px solid black`,
                    color: "orange"
                }
            }],
            defaultProps: {
                disableElevation: true,
                disableFocusRipple: true,
                disableRipple: true,
                endIcon: <Icon>star</Icon>
            }
        }
    }
});

export {
    CustomTheme
};
