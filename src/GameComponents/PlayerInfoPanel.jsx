import { Box, Typography, Grid, Paper, Button} from "@mui/material"
import { useState } from "react"


export default function PlayerInfoPanel({ photo, playername, point=0, pattern, hiragana, number}){
    const [ nowSelecting, setNowSelecting ] = useState(100);
    const [ cur_pattern, setPattern ] = useState(pattern)
    const [ isTruePattern, setIsTruePatten ] = useState(false);

    const handleSelectClick = (index) => {
        setNowSelecting(index);
    }

    const handleDicideClick = (index) => {
        if(nowSelecting != 100){
            const strArray = Array.from(cur_pattern);
            if(nowSelecting < 6 && pattern[index] == 'a'){
                strArray[index] = hiragana[nowSelecting];
            } else if(nowSelecting >= 6 && pattern[index] == 'n'){
                strArray[index] = number[nowSelecting-6];
            }
            setPattern(strArray.join(''));
            if(strArray.includes('a') != true && strArray.includes('n') != true){
                setIsTruePatten(true);
            }
            console.log(isTruePattern);
            setNowSelecting(100);
        }
    }

    const handleSubmitClick = () => {
        
    }

    return (
    <Box>
        <Grid container spacing={2}>
            <Grid item xs={5}>
                <Box sx={{height:'150px'}}>
                    <Box sx={{width:'auto',justifyContent: 'center', display: 'flex', }}>
                        <img src={`${photo}`} style={{borderRadius: '50%'}}></img>
                    </Box>
                    <Typography variant='h5' sx={{width:'auto',justifyContent: 'center', display: 'flex', }}>{playername}</Typography>
                </Box>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={4}>
                <Box sx={{height:'150px'}}>
                    <Typography variant='h4' sx={{width:'auto', height:'100px', justifyContent: 'center', textAlign:'center', alignItems:'center',display: 'flex', }}>{point}pt</Typography>
                    {isTruePattern == true ?
                        <Button fullWidth onClick={() => handleSubmitClick()} sx={{height:'50px', backgroundColor:'red', color:'black'}}>
                            <Typography variant='h4'>確定</Typography>
                        </Button>
                    :
                        <></>
                    }
                </Box>
            </Grid>
            <Grid item xs={12} sx={{height:'100px'}}>
                <Typography variant='h4' style={{ height: 'minmax(100px, 200px)', backgroundColor: '#4CAF50' }} sx={{width:'auto', height:'100px', justifyContent: 'center', textAlign:'center', alignItems:'center',display: 'flex', }}>
                {Array.from(pattern).map((char, index) => {
                    if(char === 'a'){
                        return(
                            <Button key={index} onClick={() => handleDicideClick(index)} style={{ height: '40px', width:'40px', backgroundColor: '#ffffff' }}>
                                {cur_pattern[index] !== 'a' ? cur_pattern[index] : '' }
                            </Button>
                        );
                    } else if(char === 'n'){
                        return(
                            <Button key={index} onClick={() => handleDicideClick(index)} style={{ height: '40px', width:'5px', backgroundColor: '#ffffff' }}>
                                {cur_pattern[index] !== 'n' ? cur_pattern[index] : '' }
                            </Button>
                        )
                    } else {
                        return(
                            <span key={index}>{char}</span>
                        )
                    }
                })}
                </Typography>
            </Grid>
            <Grid item xs={12} style={{height:'20px'}}></Grid>
            <Grid item xs={12} sx={{height:'100px'}}>
                <Grid container spacing={2} columnSpacing={1} rowSpacing={1}>
                    {hiragana.map((moji, index) => {
                        const isSelect = index === nowSelecting;
                        return(
                            <Grid item xs={4} style={{ height: 'minmax(100px, 200px)'}} sx={{height:'80px'}}>
                                <Button
                                    key={index} 
                                    onClick={() => handleSelectClick(index)}
                                >
                                    <Paper sx={{ padding: 2, height:'80%', display: 'flex', justifyContent: 'center', border: '2px solid black', boxSizing: 'border-box', backgroundColor: isSelect ? 'gray' : 'white'}}>
                                        <Typography variant="h5" sx={{width:'auto', height:'auto', justifyContent: 'center', textAlign:'center', alignItems:'center',display: 'flex'}}>{moji}</Typography>
                                    </Paper>   
                                </Button>
                            </Grid>  
                        );           
                    })}

                    {number.map((num, index) => {
                        const isSelect = (index+6) === nowSelecting;
                        return(
                            <Grid item xs={4} style={{ height: 'minmax(100px, 200px)'}} sx={{height:'80px'}}>
                                <Button
                                    key={index+6}  
                                    onClick={() => handleSelectClick(index+6)}
                                >
                                    <Paper sx={{ padding: 2, height:'80%', display: 'flex', justifyContent: 'center', border: '2px solid black', boxSizing: 'border-box', backgroundColor: isSelect ? 'gray' : 'white'}}>
                                        <Typography variant="h5" sx={{width:'auto', height:'auto', justifyContent: 'center', textAlign:'center', alignItems:'center',display: 'flex', }}>{num}</Typography>
                                    </Paper>
                                </Button>
                            </Grid>   
                        );          
                    })}
                </Grid>
           </Grid>

        </Grid>
    </Box>
    )
}