export function Post(){
    return(
    <>
    <div className="w-1/2 mt-10 mx-auto flex space-x-5 text-[#000C2A]">
      <img className='h-50' src="https://www.digitalocean.com/api/static-content/v1/images?src=https%3A%2F%2Fdoimages.nyc3.cdn.digitaloceanspaces.com%2F007BlogBanners2024%2Fculture-1%28vivid-sky%29.png&width=1080" alt="" />
      <div className='flex flex-col justify-between py-2'>
        <h3 className='font-bold text-xl'>Powered by DigitalOcean Hatch: Ontra Mobility is Building Smarter Cities</h3>
        <div className='flex mx-7 '>
          <p className='font-bold text-sm mr-6'>Farhan Khan</p>
          <p className='text-sm font-mono mr-3'>2025-05-22 </p>
          <p className='text-sm font-mono'>11:41 </p>
        </div>
        <p className="leading-5">Hatch is DigitalOcean’s global program for startups, which provides selected growing technology companies with credits and discounts on computing resources so they can build and scale with less worry about costs.</p>
      </div>
    </div>
    </>)
}
