import './DatingCards.css';
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import TinderCard from 'react-tinder-card';
import { Replay, Close, Favorite } from '@material-ui/icons';
import { CircularProgress, IconButton } from "@material-ui/core";
import axiosInstance from '../api/axiosInstance';
import { useAuthContext } from '../hooks/useAuthContext';

function DatingCards() {
  const [people, setPeople] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(people.length - 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [matched, setMatched] = useState('');
  const [matchedName, setMatchedName] = useState('');
  const [matchedPhoto, setMatchedPhoto] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const { user } = useAuthContext();
  const { id, firstName, lookingFor, token } = user;

  // GET DATA AND FILTER
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    async function fetchData() {
      try {
        const res = await axiosInstance.get('/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status !== 200) throw new Error('Could not get data');

        const rawUsers = res.data.users;

        const completeUsersProm = rawUsers.map(async (user) => {

          const res2 = await axiosInstance.get(`/files/${user.imgUrl}`, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            responseType: 'blob'
          });

          if (res2.status === 200) {

            const photoUrl = URL.createObjectURL(res2.data);
            return { ...user, photoUrl }

          } else {
            throw new Error('Could not get user photo')
          }
        });

        const completeUsers = await Promise.all(completeUsersProm);

        const cards = completeUsers.filter(card => card.gender === lookingFor && card.id !== id);

        if (isMounted) {
          setPeople(cards);
          setCurrentIndex(cards.length - 1);
          setLoading(false);
          setError(false);
        }

      } catch (err) {
        setLoading(false);
        setError(err.message);
        console.log(err);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // adding likes
  const addLiked = async (likedUser) => {
    if (!likedUser) return;
    try {
      const res = await axiosInstance.patch(`/liked/${id}`, { likedUser }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status !== 200) throw new Error('Could not send like');
    } catch (err) {
      console.log(err);
    }
  }

  // REFS
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(people.length)
        .fill(0)
        .map((i) => React.createRef()),
    [people.length]
  )

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  }

  // checking for swipe and undo conditions
  const canGoBack = currentIndex < people.length - 1;

  const canSwipe = currentIndex >= 0;

  // Decrease current index
  const swiped = async (dir, index, likedId, likes, name, photo) => {
    if (dir === 'right') {
      await addLiked(likedId);
      checkMatch(likes, name, photo, likedId);
    }
    updateCurrentIndex(index - 1);
  }

  const outOfFrame = (idx) => {
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  }
  // swipe cards
  async function swipe(dir) {
    if (canSwipe && currentIndex >= 0 && currentIndex < people.length) {
      // swipe the card
      await childRefs[currentIndex].current.swipe(dir);
    }
  }

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  }

  // check for match
  const checkMatch = (likes, name, photo, likedId) => {
    const isLiked = likes.filter(el => el === id)[0];
    if (isLiked) {
      setMatched(likedId);
      setMatchedName(name);
      setMatchedPhoto(photo);
    }
  }

  // Handle Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message || !matched) return;
    const body = {
      fromId: id,
      fromName: firstName,
      toId: matched,
      toName: matchedName,
      content: message,
      date: new Date()
    }
    try {
      const res = await axiosInstance.post(`/contact/${matched}`, body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status !== 200) throw new Error('Could not send message');
      setMatched('');
      setMatchedPhoto('');
      setMessage('');
      setMatchedName('');
      setSent(true);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='datingCards'>
      <div className='datingCards__container'>
        {loading && (
          <div className='loading' style={{ marginTop: '3rem' }}>
            <CircularProgress color='secondary' />
          </div>
        )}
        {error && (
          <div className='error'>
            <h3>{error}</h3>
          </div>
        )}
        {!loading && !error && !matched && !sent && people && people.map((person, index) => {
          return (
            <TinderCard
              ref={childRefs[index]}
              className="swipe"
              key={person.id}
              preventSwipe={["up", "down", "left", "right"]}
              onSwipe={(dir) => swiped(dir, index, person.id, person.likes, person.firstName, person.photoUrl)}
              onCardLeftScreen={() => outOfFrame(index)}
            >

              <div style={{ backgroundImage: `url(${person.photoUrl})` }} className="card">
                <h3>{person.firstName}, {new Date().getFullYear() - new Date(person.birthDate).getFullYear()}</h3>
              </div>
            </TinderCard>
          )
        })}
      </div>
      {matched && (
        <div className='match'>
          <h2>Congrats!! You have a match!!</h2>
          <img src={matchedPhoto} alt='matched' />
          <form onSubmit={handleSendMessage}>
            <input
              type='text'
              placeholder={`Say hi to ${matchedName}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button className='btn'>Send</button>
          </form>
        </div>
      )
      }
      {sent && (
        <div className='sent'>
          <h2>Message sent</h2>
          <Link to='/messages' className='btn'>
            Go to messages
          </Link>
        </div>
      )}
      <div className='buttons'>
        <IconButton
          onClick={() => swipe('left')}
          className={`buttons__left ${!canSwipe && 'color-disabled'}`}
        >
          <Close fontSize='large' />
        </IconButton>
        <IconButton
          onClick={() => goBack()}
          className={`buttons__repeat ${!canGoBack && 'color-disabled'}`}
        >
          <Replay fontSize='large' />
        </IconButton>
        <IconButton
          onClick={() => swipe('right')}
          className={`buttons__right ${!canSwipe && 'color-disabled'}`}
        >
          <Favorite fontSize='large' />
        </IconButton>
      </div>
    </div>
  )
}

export default DatingCards;
