import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'
import BackButton from '../../components/BackButton';
import { useNavigate } from 'react-router-dom';

const Saved = () => {
    const [ videos, setVideos ] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/api/food/save", { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods.map((item) => ({
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount,
                    savesCount: item.food.savesCount,
                    commentsCount: item.food.commentsCount,
                    foodPartner: item.food.foodPartner,
                }))
                setVideos(savedFoods)
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    alert('Please login to view saved items');
                    navigate('/user/login');
                } else {
                    console.error('Error fetching saved foods:', err)
                    setVideos([])
                }
            })
    }, [])

    const removeSaved = async (item) => {
        try {
            await axios.post("/api/food/save", { foodId: item._id }, { withCredentials: true })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) } : v))
        } catch {
            // noop
        }
    }

    return (
        <>
            <BackButton />
            <ReelFeed
                items={videos}
                onSave={removeSaved}
                emptyMessage="Nothing Saved"
            />
        </>
    )
}

export default Saved