#!/bin/bash
set -e
render(){ # name png dur
  local n=$1 png=$2 d=$3 fr; fr=$(python3 -c "print(round($d*30))")
  ffmpeg -y -loglevel error -loop 1 -framerate 30 -i "$png" -f lavfi -i anullsrc=r=44100:cl=stereo \
   -vf "scale=2160:3840,zoompan=z='1+0.035*on/$fr':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,fade=in:0:4,fade=out:$((fr-4)):4,format=yuv420p" \
   -frames:v $fr -t $d -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 128k -shortest "out/tmp_$n.mp4"
  mv "out/tmp_$n.mp4" "out/$n.mp4"
}
build(){ # prefix durations...
  local p=$1; shift; local i=0; : > out/$p.txt
  for d in "$@"; do render ${p}_$i sc/${p}_$i.png $d; echo "file '${p}_$i.mp4'" >> out/$p.txt; i=$((i+1)); done
  ffmpeg -y -loglevel error -f concat -safe 0 -i out/$p.txt -c copy out/tmp_$p.mp4 && mv out/tmp_$p.mp4 out/$p.mp4
}
build h 2.4 3.2 3.4 3.2 3.6 3.6
build c 2.4 3.2 3.4 3.4 3.0 3.6
