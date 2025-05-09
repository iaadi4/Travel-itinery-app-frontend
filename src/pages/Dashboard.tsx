const imageUrl = '/images/tokyo.png'

const Dashboard = () => {
  return (
    <div className="w-screen h-screen flex flex-col gap-[26px] p-5 font-montserrat">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-[24px] font-[800] text-primary">
            Hello Chhavi!
          </div>
          <div className="text-[16px] font-[500] text-primary">
            Ready for the trip?
          </div>
        </div>
        <div className="h-[38px] w-[38px] rounded-full bg-red text-[20px] font-[500] flex justify-center items-center">
          C
        </div>
      </div>
      <div className="w-full flex flex-col gap-[18px]">
        <div className="text-[18px] font-[700] text-primary">
          Your upcoming trip
        </div>
        <div
          className="relative w-full h-[330px] rounded-[16px] overflow-hidden"
        >
          <div
            className="absolute rounded-[16px] inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />

          {/* Main gradient overlay */}
          <div className="absolute inset-0 rounded-[16px] bg-gradient-to-t from-black/80 to-transparent z-10" />
          
          {/* Gradient blur overlay that fades toward the top */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-[16px] z-20"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)'
            }}
          />

          <div className="relative z-30 flex flex-col justify-between h-full text-white p-6">
            <div className="flex justify-between">
                <div>
                    <div className="text-[40px] font-[900] font-moderniz">TOKYO</div>
                    <div className="text-[12px] font-[600]">27.01.2025 - 02.02.2025</div>
                </div>
                <img src="/icons/link-arrow.png" className="h-[40px] w-[40px]" />
            </div>
            <div className="flex justify-between gap-1">
                <div className="flex gap-[4px] justify-start w-full">
                    <img src="/icons/clock.png" className="h-full" />
                    <div className="flex flex-col gap-[4px]">
                        <div className="text-[12px] font-[600]">8 days</div>
                        <div className="text-[10px] font-[400]">Duration</div>
                    </div>
                </div>
                <div className="flex gap-[4px] justify-center w-full">
                    <img src="/icons/people.png" className="h-full" />
                    <div className="flex flex-col gap-[4px]">
                        <div className="text-[12px] font-[600]">4 (2M,2F)</div>
                        <div className="text-[10px] font-[400]">Group Size</div>
                    </div>
                </div>
                <div className="flex gap-[4px] justify-end w-full">
                    <img src="/icons/activities.png" className="h-full" />
                    <div className="flex flex-col gap-[4px]">
                        <div className="text-[12px] font-[600]">14</div>
                        <div className="text-[10px] font-[400]">Activities</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[124px] w-full"></div>
    </div>
  );
};

export default Dashboard;