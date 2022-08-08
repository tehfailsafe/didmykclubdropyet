import { useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { supabase } from "~/supabaseClient";
import { Popover, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";

export async function loader() {
    let { data: fights, count } = await supabase
        .from("fights")
        .select(`mob, id, created_at, drops (quantity, item (name, id))`, { count: "exact" })
        .order("created_at")
        .eq("mob", 1);

    let { data: kclub } = await supabase.from("drops").select("id, item!inner(*)").eq("item.name", "Kraken Club");
    return { fights: [...(fights as [])], count, kclub: kclub!.length > 0 };
}

const dayFormat = "MMM DD, YYYY";

const Fight: React.FC<{ fight: any }> = ({ fight }) => {
    const buttonRef = useRef(null); // useRef<HTMLButtonElement>(null)
    const [openState, setOpenState] = useState(false);

    const toggleMenu = () => {
        setOpenState((openState) => !openState);
    };

    return (
        <Popover className="relative">
            <div onMouseEnter={() => toggleMenu()} onMouseLeave={() => toggleMenu()} className="flex flex-col">
                <Popover.Button
                    className="bg-green-500 w-4 h-4"
                    aria-label={`Fight hover - ${dayjs(fight.created_at).format(dayFormat)}`}
                ></Popover.Button>
                <Transition
                    show={openState}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-8"
                    enterTo="opacity-100 translate-y-5"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-5"
                    leaveTo="opacity-0 translate-y-8"
                >
                    <Popover.Panel static className="absolute z-10">
                        <div className="flex flex-col px-4 py-2 bg-white text-sm rounded text-gray-700 whitespace-nowrap shadow-md cursor-default">
                            <div className="text-lg">{dayjs(fight.created_at).format(dayFormat)}</div>
                            <div className="text-xs mb-2">{dayjs(fight.created_at).format("hh:mm a")}</div>
                            <div className="gap-4 flex justify-between">
                                <span>Oxblood</span>
                                <span>3</span>
                            </div>
                            <div className="gap-4 flex justify-between">
                                <span>Pearl</span>
                                <span>2</span>
                            </div>
                            <div className="gap-4 flex justify-between">
                                <span>Black Pearl</span>
                                <span>1</span>
                            </div>
                            {fight.drops.map((drop: any) => (
                                <div className="gap-4 flex justify-between" key={drop.id}>
                                    <span>{drop.item.name}</span>
                                    <span>{drop.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </Popover.Panel>
                </Transition>
            </div>
        </Popover>
    );
};

export default function Index() {
    const { fights, count, kclub } = useLoaderData();

    return (
        <div className="flex container flex-col mx-auto">
            <h1 className="text-xl pt-12 text-center text-gray-700">Did my Kraken Club drop yet?</h1>
            <h2 className="text-8xl text-center font-light text-gray-700">{kclub ? "YES!" : "No."}</h2>
            <div className="mt-12 flex justify-center">
                <div className="flex gap-1 w-1/2 flex-wrap">
                    {fights.map((fight) => (
                        <Fight fight={fight} key={fight.id} />
                        // <Tooltip message="test">
                        //     <div className="bg-green-500 w-4 h-4"></div>
                        // </Tooltip>
                    ))}
                </div>
            </div>
            <div className="text-center text-base text-gray-600 mt-12">Total fights: {count}</div>
        </div>
    );
}
