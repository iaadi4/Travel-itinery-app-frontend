import { useTheme } from "@/providers/theme-provider";

// Types
type Accommodation = {
  name: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  status: "Confirmed" | "Pending";
  rating: string;
  image: string;
};

type DateItem = {
  month?: string;
  date: string;
  day: string;
};

type Activity = {
  title: string;
  timing: string;
  duration: string;
  pickup: string;
  image: string;
};

// Data
const accommodations: Accommodation[] = [
  {
    name: "Shinagawa Prince Hotel",
    checkIn: "26.01.2025, 11:15 pm",
    checkOut: "28.01.2025, 11:15 am",
    duration: "2 days",
    status: "Confirmed",
    rating: "4.0 Very Good",
    image: "/images/accomodation1.png",
  },
  {
    name: "Mercure Tokyo Hotel",
    checkIn: "28.01.2025, 6:00 pm",
    checkOut: "30.01.2025, 11:15 am",
    duration: "2 days",
    status: "Pending",
    rating: "4.1 Very Good",
    image: "/images/accomodation2.png",
  },
  {
    name: "Shinagawa Prince Hotel",
    checkIn: "26.01.2025, 11:15 pm",
    checkOut: "28.01.2025, 11:15 am",
    duration: "2 days",
    status: "Confirmed",
    rating: "4.0 Very Good",
    image: "/images/tokyo.png",
  },
];

const dates: DateItem[] = [
  { month: "JAN", date: "27", day: "MON" },
  { date: "28", day: "TUE" },
  { date: "29", day: "WED" },
  { date: "30", day: "THU" },
  { date: "31", day: "FRI" },
  { month: "FEB", date: "01", day: "SAT" },
  { date: "02", day: "SUN" },
  { date: "03", day: "MON" },
];

const activities: Activity[] = [
  {
    title: "Senso-ji Temple & Nakamise Shopping Street Senso-ji",
    timing: "8:15 am Morning",
    duration: "3 hours",
    pickup: "From Hotel",
    image: "/images/activities1.png",
  },
  {
    title: "Tokyo Sky Tree",
    timing: "1:00 pm Afteroon",
    duration: "3 hours",
    pickup: "From Nakamise Street",
    image: "/images/activities2.png",
  },
  {
    title: "Kimono Wearing",
    timing: "Anytime before 8:00pm ",
    duration: "1-2 hours",
    pickup: "From Hotel",
    image: "/images/activities3.png",
  },
];

// Component for section header with "See all" link
const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex justify-between items-center">
    <div className="text-[18px] font-[700] text-secondary-foreground">
      {title}
    </div>
    <div className="text-tertiary text-[10px] font-[800] underline">
      See all
    </div>
  </div>
);

// Accommodation card component
const AccommodationCard = ({
  name,
  checkIn,
  checkOut,
  duration,
  status,
  rating,
  image,
}: Accommodation) => (
  <div className="relative flex flex-col gap-[10px] h-[239px] min-w-[220px] overflow-hidden rounded-[16px] border-[1px] border-secondary bg-primary-foreground">
    <div className="relative w-full h-[124px]">
      <img src={image} alt={name} className="w-full h-full object-cover" />
      <div className="absolute bottom-[2px] left-[8px] text-[8px] font-[700] text-[#f5f5f5] bg-blue p-[2px] flex gap-[2px] items-center">
        <img src="/icons/star.png" alt="star" className="h-full w-auto" />
        <span>{rating}</span>
      </div>
    </div>
    <div className="flex flex-col p-2 justify-between h-full">
      <div>
        <div className="text-[14px] font-[700]">{name}</div>
        <div className="text-[12px] font-[400]">
          <span className="font-[700]">Check in: </span>
          {checkIn}
        </div>
        <div className="text-[12px] font-[400]">
          <span className="font-[700]">Check out: </span>
          {checkOut}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-[12px] font-[700]">{duration}</div>
        <div
          className={`text-[12px] font-[700] flex justify-between items-center gap-2 ${
            status === "Confirmed" ? "text-[#90EB61]" : "text-[#FF6525]"
          }`}
        >
          <img
            src={`/icons/${
              status === "Confirmed" ? "confirmed" : "pending"
            }.png`}
            alt={status}
            className="h-[14px]"
          />
          <span>{status}</span>
        </div>
      </div>
    </div>
  </div>
);

// Date card component
const DateCard = ({ month, date, day }: DateItem) => {
  const isActiveMonth = month === "JAN";
  
  return month ? (
    <div
      className={`flex h-full min-w-[73px] flex-shrink-0 rounded-[8px] ${
        isActiveMonth ? "border-tertiary border-[1px]" : ""
      } overflow-hidden`}
    >
      <div
        className={`h-full p-[4px] ${
          isActiveMonth
            ? "bg-tertiary text-tertiary-foreground"
            : "bg-[#808080] text-muted"
        } text-[12px] font-[600] flex items-center`}
      >
        <div className="transform -rotate-90">{month}</div>
      </div>
      <div
        className={`flex flex-col justify-center p-[4px] rounded-r-[8px] pr-[8px] bg-accent ${
          !isActiveMonth && "text-accent-foreground"
        }`}
      >
        <div className="text-[12px] font-[500]">{day}</div>
        <div className="text-[14px] font-[600]">{date}</div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center bg-accent text-accent-foreground h-full min-w-[50px] flex-shrink-0 p-[4px] rounded-[8px]">
      <div className="text-[12px] font-[500]">{day}</div>
      <div className="text-[14px] font-[600]">{date}</div>
    </div>
  );
};

// Activity card component
const ActivityCard = ({ title, timing, duration, pickup, image }: Activity) => (
  <div className="rounded-[8px] overflow-hidden flex h-[127px] w-full border-secondary border-y-[1px] border-r-[1px]">
    <img src={image} alt={title} className="w-[127px] h-full object-cover" />
    <div className="bg-primary-foreground w-full h-full p-2 flex flex-col justify-between">
      <div className="text-[14px] font-[700]">{title}</div>
      <div className="text-[12px] font-[400] flex flex-col">
        <div>
          <span className="font-[700]">Timing: </span>
          {timing}
        </div>
        <div>
          <span className="font-[700]">Duration: </span>
          {duration}
        </div>
        <div>
          <span className="font-[700]">Pick up: </span>
          {pickup}
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { theme } = useTheme();
  const imageUrl = "/images/tokyo.png";

  return (
    <div className="w-screen h-auto flex flex-col gap-[26px] p-5 font-montserrat">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-[24px] font-[800] text-secondary-foreground">
            Hello Chhavi!
          </div>
          <div className="text-[16px] font-[500] text-secondary-foreground">
            Ready for the trip?
          </div>
        </div>
        <div className="h-[38px] w-[38px] rounded-full bg-red text-[20px] font-[500] flex justify-center items-center">
          C
        </div>
      </div>

      {/* Trip overview section */}
      <div className="w-full flex flex-col gap-[18px]">
        <div className="text-[18px] font-[700] text-secondary-foreground">
          Your upcoming trip
        </div>
        <div className="relative w-full h-[330px] rounded-[16px] overflow-hidden">
          <div
            className="absolute rounded-[16px] inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="absolute inset-0 rounded-[16px] bg-gradient-to-t from-black/80 to-transparent z-10" />
          <div
            className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-[16px] z-20"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
            }}
          />

          <div className="relative z-30 flex flex-col justify-between h-full text-white p-6">
            <div className="flex justify-between">
              <div>
                <div className="text-[40px] font-[900] font-moderniz">
                  TOKYO
                </div>
                <div className="text-[12px] font-[600]">
                  27.01.2025 - 02.02.2025
                </div>
              </div>
              <img src="/icons/link-arrow.png" className="h-[40px] w-[40px]" alt="Link arrow" />
            </div>
            <div className="flex justify-between gap-1">
              <div className="flex gap-[4px] justify-start w-full">
                <img src="/icons/clock.png" className="h-full" alt="Clock icon" />
                <div className="flex flex-col gap-[4px]">
                  <div className="text-[12px] font-[600]">8 days</div>
                  <div className="text-[10px] font-[400]">Duration</div>
                </div>
              </div>
              <div className="flex gap-[4px] justify-center w-full">
                <img src="/icons/people.png" className="h-full" alt="People icon" />
                <div className="flex flex-col gap-[4px]">
                  <div className="text-[12px] font-[600]">4 (2M,2F)</div>
                  <div className="text-[10px] font-[400]">Group Size</div>
                </div>
              </div>
              <div className="flex gap-[4px] justify-end w-full">
                <img src="/icons/activities.png" className="h-full" alt="Activities icon" />
                <div className="flex flex-col gap-[4px]">
                  <div className="text-[12px] font-[600]">14</div>
                  <div className="text-[10px] font-[400]">Activities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flight details section */}
      <div className="relative h-auto overflow-hidden w-full px-[12px] py-[8px] rounded-[16px] bg-[#3643FB]">
        <div className="relative flex gap-[16px] flex-col h-full w-full bg-[#313DDF] p-1 rounded-[12px] text-white">
          <div className="flex justify-between">
            <div>
              <div className="font-[700] text-[16px]">Flight Details</div>
              <div className="text-[14px] font-[400]">26.01.2025, 10:50 am</div>
            </div>
            <div className="text-[10px] font-[800] underline">See all</div>
          </div>
          <div className="flex justify-start items-center gap-[16px]">
            <div>
              <div className="text-[16px] font-[700]">DEL</div>
              <div className="text-[12px] font-[400]">Delhi, India</div>
            </div>
            <img src="/icons/right-arrow.png" alt="Right arrow" />
            <div>
              <div className="text-[16px] font-[700]">NRT</div>
              <div className="text-[12px] font-[400]">Narita, Tokyo</div>
            </div>
          </div>
        </div>
        <img
          className="absolute right-0 top-0 h-full z-10"
          src="/images/plane.png"
          alt="Plane"
        />
      </div>

      {/* Accommodation section */}
      <div className="flex flex-col gap-[16px]">
        <SectionHeader title="Accomodation" />
        <div className="flex gap-[16px] overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
          {accommodations.map((accommodation, index) => (
            <AccommodationCard key={index} {...accommodation} />
          ))}
        </div>
      </div>

      {/* Activities section */}
      <div className="flex flex-col gap-[16px]">
        <SectionHeader title="Activities" />
        <div className="h-[114px] flex flex-col gap-[18px] w-full bg-primary-foreground py-[10px] rounded-[12px] border-secondary border-[1px]">
          <div className="flex justify-start items-center ml-[10px] gap-[8px]">
            <div className="bg-tertiary text-[12px] font-[600] text-tertiary-foreground py-[4px] px-[8px] rounded-[8px]">
              Day Plan
            </div>
            <div className="border-tertiary bg-accent border-[0.5px] text-[12px] font-[600] py-[4px] px-[8px] rounded-[8px] text-tertiary">
              14 activities
            </div>
          </div>
          <div className="flex overflow-x-auto gap-[8px] pl-[10px] pr-4 no-scrollbar">
            {dates.map((date, index) => (
              <DateCard key={index} {...date} />
            ))}
          </div>
        </div>
        
        <div className="flex gap-[18px]">
          <div className="flex gap-[10px] p-[4px] rounded-[8px] bg-tertiary text-tertiary-foreground text-[12px] font-[600]">
            <span>Day 1</span>
            <span>27.01.2025</span>
          </div>
          <div className="flex items-center gap-[4px]">
            <img
              src={`/icons/activities-${theme === "dark" ? "dark" : "light"}.png`}
              className="h-[10.5px]"
              alt="Activities icon"
            />
            <span className="text-tertiary text-[12px] font-[600]">
              3 Activities
            </span>
          </div>
        </div>
        
        <div className="w-full h-auto flex flex-col gap-[10px] border-tertiary border-[1px] rounded-[8px] p-[4px]">
          {activities.map((activity, index) => (
            <ActivityCard key={index} {...activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;