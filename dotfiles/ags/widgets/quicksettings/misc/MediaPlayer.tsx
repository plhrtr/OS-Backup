import { bind, execAsync } from "astal";
import { App, Gtk } from "astal/gtk4";
import Mpris from "gi://AstalMpris";
import Wp from "gi://AstalWp";

function hex_to_rgb(color: string) {
  return {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16),
  };
}

function lighten_color(color: string, percentage: number) {
  const rgb = hex_to_rgb(color);
  return {
    r: Math.min(255, rgb.r + (255 - rgb.r) * percentage),
    g: Math.min(255, rgb.g + (255 - rgb.g) * percentage),
    b: Math.min(255, rgb.b + (255 - rgb.b) * percentage),
  };
}

function Player({ player }: { player: Mpris.Player }) {
  const speaker = Wp.get_default()?.get_default_speaker();

  const coverArt = bind(player, "coverArt").as((path) => {
    execAsync(["bash", "-c", `matugen image ${path} --dry-run -j hex`])
      .then((str) => {
        let colors = JSON.parse(str).colors;
        colors = colors.dark;

        const primary = lighten_color(colors.primary, 0.6);
        const primary_hover = lighten_color(colors.primary, 0.4);

        const player_name = player.busName.split(".").pop();
        const css = `
                .${player_name}-cover-art-background {
                    background-image: url(file://${path}); 
                    transition: background-image 200ms cubic-bezier(0, 0, 0.2, 1);
                }

                button.${player_name}-play-button {
                    background-color: rgb(${primary.r}, ${primary.g}, ${
                      primary.b
                    });
                }

                button.${player_name}-play-button:hover {
                    background-color: rgb(${primary_hover.r}, ${
                      primary_hover.g
                    }, ${primary_hover.b});
                }

                image.${player_name}-play-icon {
                    color: ${colors.on_primary};
                }

                box.${player_name}-overlay {
                    background: radial-gradient(
                        circle,
                        rgba(${parseInt(
                          colors.on_primary.slice(1, 3),
                          16,
                        )}, ${parseInt(
                          colors.on_primary.slice(3, 5),
                          16,
                        )}, ${parseInt(colors.on_primary.slice(5, 7), 16)}, 0.5),
                        rgba(${parseInt(
                          colors.on_primary.slice(1, 3),
                          16,
                        )}, ${parseInt(
                          colors.on_primary.slice(3, 5),
                          16,
                        )}, ${parseInt(colors.on_primary.slice(5, 7), 16)}, 0.7)
                    );
                }

                .${player_name}-spotify-logo {
                    background-color: rgb(${primary.r}, ${primary.g}, ${
                      primary.b
                    });
                    color: ${colors.on_primary};
                }

                .${player_name}-playback-device {
                    background-color: rgb(${primary.r}, ${primary.g}, ${
                      primary.b
                    });
                    color: ${colors.on_primary};
                }
            `;
        App.apply_css(css);
      })
      .catch((error) => print(error));
    return [
      "cover-art",
      `${player.busName.split(".").pop()}-cover-art-background`,
    ];
  });

  const title = bind(player, "title").as((title) => {
    return title
      ? title.length > 30
        ? title.substring(0, 30) + "..."
        : title
      : "Unknown title";
  });
  const artist = bind(player, "artist").as((artist) => {
    return artist
      ? artist.length > 30
        ? artist.substring(0, 30) + "..."
        : artist
      : "Unknown artist";
  });

  const playIcon = bind(player, "playbackStatus").as((s) =>
    s === Mpris.PlaybackStatus.PLAYING
      ? "media-playback-pause-symbolic"
      : "media-playback-start-symbolic",
  );

  const playbackPosition = bind(player, "position").as((p) =>
    player.length > 0 ? p / player.length : 0,
  );

  return (
    <box visible={bind(player, "available")} cssClasses={["media-player"]}>
      <overlay>
        <box hexpand cssClasses={coverArt} />
        <box
          type="overlay"
          cssClasses={["overlay", `${player.busName.split(".").pop()}-overlay`]}
          hexpand
        />
        <box
          type="overlay"
          hexpand
          valign={Gtk.Align.START}
          cssClasses={["header"]}
        >
          <box hexpand>
            {player.identity === "Spotify" ? (
              <button
                iconName={"org.gnome.Lollypop-spotify-symbolic"}
                cssClasses={[
                  "spotify-logo",
                  `${player.busName.split(".").pop()}-spotify-logo`,
                ]}
                onClicked={() => {
                  execAsync([
                    "bash",
                    "-c",
                    "hyprctl dispatch focuswindow 'class:spotify'",
                  ]);
                }}
                halign={Gtk.Align.START}
              />
            ) : (
              <button
                iconName={"media-optical-cd-audio-symbolic"}
                cssClasses={[
                  "spotify-logo",
                  `${player.busName.split(".").pop()}-spotify-logo`,
                ]}
                halign={Gtk.Align.START}
              />
            )}
          </box>
          <box
            cssClasses={[
              "playback-device",
              `${player.busName.split(".").pop()}-playback-device`,
            ]}
            halign={Gtk.Align.END}
          >
            {bind(speaker, "name").as((speaker) =>
              speaker ? speaker : "Default",
            )}
          </box>
        </box>
        <box type="overlay" valign={Gtk.Align.CENTER}>
          <box
            vertical
            hexpand
            halign={Gtk.Align.START}
            valign={Gtk.Align.CENTER}
            cssClasses={["song-info"]}
          >
            <box cssClasses={["title"]}>{title}</box>
            <box cssClasses={["artist"]}>{artist}</box>
          </box>
          <button
            halign={Gtk.Align.END}
            cssClasses={[
              "play-button",
              `${player.busName.split(".").pop()}-play-button`,
            ]}
            onClicked={() => player.play_pause()}
          >
            <image
              iconName={playIcon}
              cssClasses={[
                "play-icon",
                `${player.busName.split(".").pop()}-play-icon`,
              ]}
            />
          </button>
        </box>
        <box
          type="overlay"
          valign={Gtk.Align.END}
          cssClasses={["media-controls"]}
        >
          <button
            onClicked={() => player.previous()}
            visible={bind(player, "canGoPrevious")}
          >
            <image iconName="media-skip-backward-symbolic" />
          </button>
          <slider
            visible={bind(player, "length").as((l) => l > 0)}
            onButtonReleased={(slider) => {
              player.set_position(slider.value * player.length);
            }}
            value={playbackPosition}
            hexpand
            widthRequest={100}
          />
          <button
            onClicked={() => player.next()}
            visible={bind(player, "canGoNext")}
          >
            <image iconName="media-skip-forward-symbolic" />
          </button>
        </box>
      </overlay>
    </box>
  );
}

export default function MediaPlayer() {
  const mpris = Mpris.get_default();
  return (
    <box
      vertical
      spacing={10}
      visible={bind(mpris, "players").as((player) => player.length > 0)}
    >
      {bind(mpris, "players").as((arr) =>
        arr.map((player) => <Player player={player} />),
      )}
    </box>
  );
}
