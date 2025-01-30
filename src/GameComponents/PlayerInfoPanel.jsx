import { Box, Typography, Grid, Paper, Button} from "@mui/material"
import { useState, useEffect} from "react"


export default function PlayerInfoPanel({ photo, playername, point=0, pattern="", hiragana=[], number=[], sendGameData}){
    const [ nowSelecting, setNowSelecting ] = useState(100);
    const [ cur_pattern, setPattern ] = useState(pattern)
    const [ isTruePattern, setIsTruePatten ] = useState(false);
    const [ isLocked, setIsLocked ] = useState(false);

    useEffect (() => {
        setPattern(pattern);
    },[pattern]);

    const handleSelectClick = (index) => {
        if(!isLocked){
            setNowSelecting(index);
        }
    }

    const handleDicideClick = (index) => {
        if(!isLocked){
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
                console.log(cur_pattern);
                setNowSelecting(100);
            }
        }
    }

    const handleSubmitClick = () => {
        sendGameData(cur_pattern);
        setIsTruePatten(false);
        setIsLocked(true);
    }

    return (
        <Grid container>
            <Grid item xs={5} style={{height:'30%'}}>
                <Grid container direction="column" alignItems="center">
                    <Grid item xs={8} sm={8} md={8}>
                        <Box sx={{width:'auto',justifyContent: 'center'}}>
                            <img src={`${photo}`} style={{borderRadius: '50%'}}></img>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4}>
                        <Typography variant='h5' sx={{width:'auto',justifyContent: 'center'}}>{playername}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3} style={{height:'30%'}}></Grid>
            <Grid item xs={4} style={{height:'50%'}}>
                <Grid container direction="column" alignItems="center" spacing={3}>
                    <Grid item>
                        <Typography variant='h4' sx={{width:'auto', justifyContent: 'center'}}>{point}pt</Typography>
                    </Grid>
                    <Grid item>
                        {isTruePattern == true ?
                            <Button fullWidth onClick={() => handleSubmitClick()} sx={{backgroundColor:'red', color:'black'}}>
                                <Typography variant='h4'>確定</Typography>
                            </Button>
                        :
                            <></>
                        }
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{height:'15%', backgroundColor:'black'}}>
                <Typography variant='h4' style={{ backgroundColor: '#4CAF50' }} sx={{width:'auto', height:'80px', justifyContent: 'center', textAlign:'center', alignItems:'center',display: 'flex', }}>
                {Array.from(pattern).map((char, index) => {
                    if(char === 'a'){
                        return(
                            <Button key={index} onClick={() => handleDicideClick(index)} style={{ height: '40px', width:'40px', backgroundColor: '#ffffff' }}>
                                <Typography variant='h4'>{cur_pattern[index] !== 'a' ? cur_pattern[index] : '' }</Typography>
                            </Button>
                        );
                    } else if(char === 'n'){
                        return(
                            <Button key={index} onClick={() => handleDicideClick(index)} style={{ height: '40px', width:'5px', backgroundColor: '#ffffff' }}>
                                <Typography variant='h4'>{cur_pattern[index] !== 'n' ? cur_pattern[index] : '' }</Typography>
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
            <Grid item xs={12} sx={{height:'50%'}}>
                <Grid container spacing={2} columnSpacing={1} rowSpacing={1}>
                    {hiragana != [] ?
                        hiragana.map((moji, index) => {
                            const isSelect = index === nowSelecting;
                            return(
                                <Grid item xs={4} key={index} style={{ height: 'minmax(100px, 200px)'}} sx={{height:'80px'}}>
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
                        })
                    :
                        <></>
                    }

                    {number != [] ?
                        number.map((num, index) => {
                            const isSelect = (index+6) === nowSelecting;
                            return(
                                <Grid item xs={4} key={index+6} style={{ height: 'minmax(100px, 200px)'}} sx={{height:'80px'}}>
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
                        })
                    :
                        <></>
                    }
                </Grid>
           </Grid>

        </Grid>
    )
}