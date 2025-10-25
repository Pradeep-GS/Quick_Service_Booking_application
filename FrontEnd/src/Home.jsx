import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div className='container bg-[var(--primary--color)] max-w-full h-[100vh] flex justify-center flex-col items-center p-3'>
        <div className="container bg-white min-w-[50%] max-h-max flex flex-col justify-around p-3">
            <h2 className='text-center text-4xl mt-3'>Welcome To <span className='text-[var(--primary--color)] font-extrabold'>Q</span>uick <span className='text-[var(--primary--color)] font-extrabold'>S</span>ervice <span className='text-[var(--primary--color)] font-extrabold'>B</span>ooking <span className='text-[var(--primary--color)] font-extrabold'>A</span>pp</h2>
            <div className="text-center mt-20 p-2">
                <p>Looking for a reliable professional to get the job done quickly? Whether it’s fixing a leaking pipe, repairing your car, installing electrical appliances, or getting tutoring help, QuickServe connects you with verified and skilled service providers near you. Our mission is simple: to make service booking fast, convenient, and hassle-free.</p>
                <p>With QuickServe, you can explore a wide range of services, read genuine reviews, compare providers, and book your preferred professional instantly. No more endless calls, waiting, or uncertainty—everything you need is just a click away.</p> <br />
                <p><strong className='text-[var(--primary--color)] font-extrabold'>Customers:</strong> Log in to find the best service providers in your area. From home repairs to personal lessons, book services on your schedule and enjoy reliable, high-quality results every time. Manage your bookings, track progress, and provide feedback to ensure continuous improvement.</p>
                <p><strong className='text-[var(--primary--color)] font-extrabold'>Service Providers:</strong> Log in to grow your business, reach more clients, and manage your bookings efficiently. Showcase your skills, set your availability, and get rated by satisfied customers, helping you build trust and expand your professional reputation.</p>
                <p>QuickServe is designed for everyone who values <strong className='text-[var(--primary--color)] font-extrabold'>time, convenience, and quality</strong>. Our platform ensures seamless communication between customers and providers, making every booking smooth and stress-free. Whether it’s an urgent repair, routine maintenance, or expert tutoring, QuickServe brings the right professional to your doorstep.</p>
                <p>Experience a smarter way to book and provide services—<strong className='text-[var(--primary--color)] font-extrabold'>join QuickServe today and make every task easier, faster, and more reliable</strong>.</p>
              </div>

            <div className='mt-10 mx-auto flex justify-center gap-4'>
                <Link to={"/user/login"} className=' outline-none px-4 py-2 bg-[var(--primary--color)] text-white hover:text-[var(--primary--color)] hover:bg-white hover:border-[1px] '>Log In As Customer</Link>
                <Link to={"/service/login"} className='border-[1px] outline-none px-4 py-2 text-[var(--primary--color)] bg-white hover:bg-[var(--primary--color)] hover:text-white'>Log In As Servicer</Link>
            </div>
        </div>
    </div>
  )
}

export default Home