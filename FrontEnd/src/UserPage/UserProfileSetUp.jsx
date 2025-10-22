import{ useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const UserProfileSetUp = () => {
  const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Côte d'Ivoire",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Congo-Brazzaville)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia (Czech Republic)",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini (fmr. Swaziland)",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar (formerly Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine State",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe"
]
  const locate = useLocation()
  const navigate =useNavigate()
  const {name,email,password,phone}=locate.state
  const verify =(e)=>{
    e.preventDefault()
    alert(`Name: ${form.name}
          DOB: ${form.dob}
          Age: ${form.age}
          Email: ${form.mail}
          Password: ${form.password}
          Mobile: ${form.mobile}
          Address: ${form.address}
          Pincode: ${form.pincode}
          District: ${form.district}
          State: ${form.state}
          Country: ${form.country}\n`);
    navigate("/user/dashboard")
  }
  const[form,setform]=useState({
    userName:locate.state.name,
    mailID:locate.state.email,
    password:locate.state.password,
    mobileNumber:locate.state.phone,
    dob:"",
    age:"",
    country:"",
    address:"",
    pincode:"",
    district:"",
    state:"",
  })
const agecalci = (e)=>{
  const dob = e.target.value;
  const bdate =dob.split("-")[0]
  const date = new Date().getFullYear()
  const age = date-bdate
  setform({...form,dob:dob,age:age})
}
  const change = (e)=>{
    setform({...form,[e.target.name]:e.target.value})
  }
  return (
    <div className='w-full h-[100vh] bg-[var(--primary--color)] flex items-center justify-center'>
        <div className="container w-[90%] h-[90vh] bg-white p-5 rounded-2xl overflow-hidden">
            <h3 className='text-center text-4xl text-[var(--primary--color)] mt-2'>Profile Setup</h3>
            <div className='container w-full max-h-fit grid grid-cols-2 gap-2 mt-5'>
                <div className="h-full p-2">
                  <div className='w-full p-1 mt-5'>
                    <label htmlFor="name" >Your Name</label>
                    <input type="text" name="name" id='name' value={form.userName} placeholder='Enter Your Name' required className='w-[100%] border-[1px] p-1 outline-none' onChange={change} autoComplete="off" />
                  </div>
                  <div className='w-full p-1 mt-5 grid grid-cols-2 gap-3'>
                    <div>
                      <label htmlFor="dob">Date OF Birth</label>
                      <input type="date" name="dob" id="dob" className='border-[1px] w-full p-1' required onChange={agecalci} autoComplete="off"/>
                    </div>
                     <div>
                      <label htmlFor="dob">Your Age</label>
                      <input type="text" name="age" id="age" className='border-[1px] w-full p-1' value={form.age} placeholder='Enter Your Age'required  autoComplete="off" readOnly/>
                    </div>
                  </div>
                  <div className='w-full p-1 mt-5'>
                    <label htmlFor="mail" >Your E-Mail Id</label>
                    <input type="email" name="mail" id='mail' value={form.mailID} placeholder='Enter Your Mail Id' required className='w-[100%] border-[1px] p-1 outline-none' onChange={change} autoComplete="off"/>
                  </div>

                  <div className='w-full p-1 mt-5'>
                    <label htmlFor="password" >Your Password</label>
                    <input type="password" name="password" value={form.password}  id='password' placeholder='Enter Your Password' required className='w-[100%] border-[1px] p-1 outline-none'onChange={change} autoComplete="off"/>
                    <Link className='text-[var(--primary--color)] font-extrabold mt-[20px] text-[13px]'>Forget Password?</Link>
                  </div>

                  <div className='w-full p-1 mt-5'>
                    <label htmlFor="mobile" >Your Mobile Number</label>
                    <input type="text" name="mobile" id='mobile' value={form.mobileNumber} placeholder='Enter Your Mobile Number' required className='w-[100%] border-[1px] p-1 outline-none'onChange={change}autoComplete="off" />
                  </div>
                </div>
                <div className="h-full  p-2">
                  <div className='w-full p-1 mt-5'>
                    <label htmlFor="country mt-5" >Selet Your Coutry</label>
                      <select className='mx-5 border-[1px] outline-none p-1 mt-5' name='country' onChange={change} placeholder='Select Your Country' value={form.country}>
                        <optgroup label="Select Your Country" placeholder='Select Your Country'>
                            <option value="" disabled>
                                Select Your Country
                            </option>
                          {countries.map((name, index) => (
                            <option key={index} value={name} className=''>
                              {name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                  </div>
                  <div className='w-full p-1 mt-5'>
                    <label htmlFor="address" >Your Address</label>
                    <textarea rows="5" type="address" name="address" id='address' placeholder='Enter Your Address' required className='w-[100%] border-[1px] p-1 outline-none' onChange={change} autoComplete="off"/>
                    <div className='w-full  grid grid-cols-2'>
                      <div className='w-full p-1 mt-5'>
                          <label htmlFor="pincode">Your Pincode</label>
                          <input type="text" name="pincode" id='pincode' placeholder='Enter Your Pincode' required className='w-[100%] border-[1px] p-[2px] outline-none'onChange={change} autoComplete="off"/>
                      </div>
                      <div className='w-full p-1 mt-5'>
                          <label htmlFor="district">Your District</label>
                          <input type="text" name="district" id='district' placeholder='Enter Your District' required className='w-[100%] border-[1px] p-[2px] outline-none'onChange={change} autoComplete="off" />
                      </div>
                      <div className='w-full p-1 mt-5'>
                          <label htmlFor="state">Your State</label>
                          <input type="text" name="state" id='state' placeholder='Enter Your State' required className='w-[100%] border-[1px] p-[2px] outline-none'onChange={change} autoComplete="off"/>
                      </div>
                    </div>
                      <button className='w-full mt-5 bg-[var(--primary--color)] px-2 py-2 text-white' onClick={verify}>Update The Changes</button>
                  </div>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default UserProfileSetUp