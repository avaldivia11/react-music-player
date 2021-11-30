import React, { useState, useEffect, useRef } from "react";

const MusicList = () => {
  const [url] = useState("https://assets.breatheco.de/apis/sound/songs");
  const [songMap, setSongMap] = useState({});
  const [setId, setSetId] = useState(1);
  const [condicion, setCondicion] = useState(false);
  const [playList, setPlaylist] = useState("");
  const [songs, setSongs] = useState([]);

  let audioRef = useRef();


  useEffect(() => {
    getSongs(url);
  },[]);

  const getSongs = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "aplication/json",
        },
      });
      const data = await response.json();
      setSongs(data);
      const object = {};
      data.map((cancion) => {
        return (object[cancion.id] = cancion.url);
      });
      setSongMap(object);
    } catch (error) {
      console.log(error);
    }
  };



  const reproducir = (url) => {
    if (
      audioRef.current.src ===
      "https://assets.breatheco.de/apis/sound/" + url
    ) {
      audioRef.current.play();
    } else {
      audioRef.current.src = "https://assets.breatheco.de/apis/sound/" + url;
      audioRef.current.play();
    }
    setCondicion(true);    
  };
  const pausar = () => {
    audioRef.current.pause();
    setCondicion(false);
  };

  const next = (id, songs) => {
    let nextSong = songMap[id + 1] ? songMap[id + 1] : songMap[1];
    audioRef.current.src = "https://assets.breatheco.de/apis/sound/" + nextSong;
    setPlaylist(songs);
    setSetId(songMap[id + 1] ? id + 1 : 1);


    audioRef.current.play();
  };
  const prev = (id, songs) => {
    let prevSong = songMap[id - 1];
    audioRef.current.src = "https://assets.breatheco.de/apis/sound/" + prevSong;
    setPlaylist(songs);
    setSetId(id - 1);
    audioRef.current.play();
  };

  return (
    <div className="list-group">
      {songs.length === 0
        ? "Cargando..."
        : songs.map((song, index) => {
            return (
              <div className="musiclist" key={index}>
                <button
                  type="button"
                  className={`botones mb-5 list-group-item rounded-pill list-group-item-primary ${song.id === setId && "active"}`}onClick={() => { 
                    reproducir(song.url);
                    setPlaylist(song.url);
                    setSetId(song.id)}}>
                    {song.name}
                </button>
                <audio id="player" src="" ref={audioRef} />
              </div>
            );
          })}
      <div className="justify-content-center fixed-bottom navbar ">
        <button
          className="btns mx-5"
          onClick={() => prev(setId, songs[setId - 1])}
        >
          <i className=" fas fa-caret-square-left fa-2x "></i>
        </button>

        {condicion ? (
          <button className="btns" onClick={() => pausar(playList)}>
            <i className=" fas fa-pause-circle fa-2x"></i>
          </button>
        ) : (
          <button className="btns" onClick={() => reproducir(playList)}>
            <i className=" fas fa-play fa-2x"></i>
          </button>
        )}

        <button
          className="btns mx-5"
          onClick={() => next(setId, songs[setId + 1])}
        >
          <i className=" fas fa-caret-square-right fa-2x "></i>
        </button>
      </div>
    </div>
  );
};

export default MusicList;
