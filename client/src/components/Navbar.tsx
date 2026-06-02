import { useState } from "react";

import {
  Bell,
  Settings,
  Search,
  LogOut,
} from "lucide-react";

const Navbar = () => {

  // ==========================
  // STATES
  // ==========================

  const [search,
    setSearch] =
    useState("");

  const [showSettings,
    setShowSettings] =
    useState(false);

  const [showNotifications,
    setShowNotifications] =
    useState(false);

  // ==========================
  // NOTIFICATIONS
  // ==========================

  const notifications = [

    "Interview completed",

    "XP earned",

    "Badge unlocked",

  ];

  return (

    <div className="flex items-center justify-between mb-8 gap-4">

      {/* SEARCH */}

      <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2 flex-1 max-w-md">

        <Search
          size={18}
          className="text-zinc-500 mr-2"
        />

        <input

          type="text"

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          placeholder="Search questions, topics..."

          className="bg-transparent outline-none text-sm text-white w-full"

        />

      </div>

      {/* RIGHT ACTIONS */}

      <div className="flex items-center gap-3">

        {/* NOTIFICATIONS */}

        <div className="relative">

          <button
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            className="p-3 rounded-2xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition"
          >

            <Bell
              size={18}
              className="text-zinc-300"
            />

          </button>

          {showNotifications && (

            <div className="absolute right-0 mt-3 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 z-50 shadow-xl">

              <h3 className="text-white text-sm font-bold mb-4">

                Notifications

              </h3>

              <div className="space-y-3">

                {notifications.map(
                  (note, idx) => (

                    <div
                      key={idx}
                      className="bg-zinc-800 text-zinc-300 p-3 rounded-xl text-sm"
                    >

                      {note}

                    </div>

                  )
                )}

              </div>

            </div>

          )}

        </div>

        {/* SETTINGS */}

        <div className="relative">

          <button
            onClick={() =>
              setShowSettings(
                !showSettings
              )
            }
            className="p-3 rounded-2xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition"
          >

            <Settings
              size={18}
              className="text-zinc-300"
            />

          </button>

          {showSettings && (

            <div className="absolute right-0 mt-3 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 z-50 shadow-xl">

              <h3 className="text-white text-sm font-bold mb-4">

                Settings

              </h3>

              <div className="space-y-3">

                <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-xl text-sm">

                  Dark Theme

                </button>

                <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-xl text-sm">

                  Font Size

                </button>

                <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-xl text-sm">

                  Editor Settings

                </button>

              </div>

            </div>

          )}

        </div>

        {/* LOGOUT */}

        <button className="p-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 transition">

          <LogOut
            size={18}
            className="text-rose-400"
          />

        </button>

      </div>

    </div>

  );

};

export default Navbar;