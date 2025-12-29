import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import BackButton from '../../components/BackButton';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [ videos, setVideos ] = useState([])
    const navigate = useNavigate();
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        axios.get("/api/food", { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos(response.data.foodItems)
            })
            .catch(err => {
                console.error('Failed to load videos:', err.response?.data || err);
            })
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {

        // client-side quick auth check to avoid unnecessary network call
        if (!axios.defaults.headers.common['Authorization']) {
            const err = new Error('Unauthorized');
            err.response = { status: 401 };
            throw err;
        }

        const response = await axios.post("/api/food/like", { foodId: item._id }, {withCredentials: true})

        if(response.data.like){
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
        }else{
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
        }
        
    }

    async function saveVideo(item) {
        if (!axios.defaults.headers.common['Authorization']) {
            const err = new Error('Unauthorized');
            err.response = { status: 401 };
            throw err;
        }

        const response = await axios.post("/api/food/save", { foodId: item._id }, { withCredentials: true })
        
        if(response.data.save){
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
        }else{
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
        }
    }

    return (
        <>
            <BackButton />
            <ReelFeed
                items={videos}
                onLike={async (item) => {
                    try {
                        await likeVideo(item)
                    } catch (err) {
                        if (err.response?.status === 401) {
                            alert('Please login to like videos');
                            navigate('/user/login');
                        }
                    }
                }}
                onSave={async (item) => {
                    try {
                        await saveVideo(item)
                    } catch (err) {
                        if (err.response?.status === 401) {
                            alert('Please login to save videos');
                            navigate('/user/login');
                        }
                    }
                }}
                emptyMessage="No videos available."
            />
        </>
    )
}

export default Home