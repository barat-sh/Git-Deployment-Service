import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box } from '@mui/material';

const Landing = () =>{
    const [repoUrl, setRepoUrl] = useState('');
    const [deployID, setDeployId] = useState("");

    const handleChange = () => {
        if (repoUrl !== ""){
            console.log(repoUrl)
            axios.post("http://localhost:3001/deploy", {
                repoURL: repoUrl
            }).then((response: AxiosResponse) => {
                console.log(response.data);
                setDeployId(response.data?.sessionID);
            })
            .catch((error)=>{
                console.log(error)
            })
        }
    }

    return (
        <div>
            <Card style={{ padding: "30px", backgroundColor: "#aeb0af", borderRadius: "20px"}}>
                <CardContent>
                    <Box margin={2}>
                        <Typography variant='h5' fontWeight={"400"}>
                            Please enter your React Github URL
                        </Typography>
                    </Box>
                    <Box margin={2}>
                        <TextField id="standard-basic" size='small' label="GitHub URL" fullWidth variant="standard" onChange={(e)=>{setRepoUrl(e.target.value)}} />
                        <Typography fontSize={12} fontWeight={100} style={{ color: "red"}}>Note: It barely takes one minute to deploy your site. Please wait...</Typography>
                    </Box>
                </CardContent>
                <CardActions>
                    <Box marginLeft={2}>
                        <Button variant='outlined' size='small' color='success' onClick={handleChange}>Clone & Deploy</Button>
                    </Box>
                </CardActions>
            </Card>
            <div style={{ marginTop: "8px"}}>
                <Deployment id={deployID} />
            </div>
        </div>
    )
}

interface DeploymentProps {
    id: string
}

const Deployment: React.FC<DeploymentProps> = (props) =>{
    return (
        <div>
            <Card style={{backgroundColor: "#939694", borderRadius: "20px"}}>
                <CardContent>
                    <Box margin={2}>
                        <Typography style={{ color: "tomato"}} fontWeight={"700"}>
                            Deployment Status.
                        </Typography>
                    </Box>
                    <Box margin={2}>
                        <Typography style={{ color: "green" }} fontWeight={"100"}>
                            Your request is in Build stage. please wait...
                        </Typography>
                    </Box>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} gap={2}>
                        <TextField value={props.id ? `${props.id}.versel.com:3000/index.html` : "empty"} size='small' variant="outlined"/>
                        <ContentCopyIcon/>
                    </Box>
                </CardContent>
            </Card>
        </div>
    )
}

export default Landing;