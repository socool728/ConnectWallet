import { Container } from "@mui/material";

interface MainContainerProps
{
    children: React.ReactNode;
}

export default function MainContainer(props: MainContainerProps): JSX.Element
{
    return (
        <Container sx={{ padding: "20px 0", border: "solid black 2px" }} maxWidth="md">
            {props.children}
        </Container>
    );
}
