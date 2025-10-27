import axios from 'axios'
import{ useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const ServiceProfilesetup = () => {
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
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

useEffect(() => {
  async function fetchCategories() {
    try {
      const res = await axios.get("http://localhost:8080/service/getcat");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  }
  fetchCategories();
}, []);
const locate = useLocation()
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
    gender:"",
    exp:"",
    package:""
  })
const formDataToSend = {
  name: form.userName,
  email: form.mailID,
  password: form.password,
  mobileNumber: form.mobileNumber,
  gender: form.gender,
  serviceProviding: selectedCategories.map(id => ({ categoryId: parseInt(id) })),
  yearOfExperience: parseInt(form.exp),
  salaryPerHr: parseFloat(form.package),
  dob: form.dob,
  age: parseInt(form.age),
  country: form.country,
  address: form.address,
  pincode: form.pincode,
  district: form.district,
  state: form.state
};

  
  const navigate =useNavigate()
  const {name,email,password,phone}=locate.state
  const verify =async(e)=>{
    e.preventDefault()
    try{
      const response = await axios.post("http://localhost:8080/service/sigup",formDataToSend);
      const result = response.data;

      if(result.success)
      {
        navigate("/user/dashboard")
      }
      else{
        alert("Some error")
      }
    }
    catch(e)
    {
      console.log(e);
    }
  }
  
const agecalci = (e) => {
  const dob = e.target.value;
  if (!dob) return;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  setform({ ...form, dob: dob, age: age });
};

  const change = (e)=>{
    setform({...form,[e.target.name]:e.target.value})
  }
  return (
    <div className='w-full  bg-[var(--primary--color)] flex items-center justify-center p-6'>
        <div className="container w-[90%] h-[100vh] bg-white p-5 rounded-2xl overflow-hidden">
            <h3 className='text-center text-4xl text-[var(--primary--color)] mt-2'>Profile Setup</h3>
            <div className='container w-full max-h-fit grid grid-cols-2 gap-2 mt-5'>
                <div className="h-full p-2">
                  <div className='w-full p-1 mt-5'>
                    <label htmlFor="name" >Your Name</label>
                    <input type="text" name="userName" id='userName' value={form.userName} placeholder='Enter Your Name' required className='w-[100%] border-[1px] p-1 outline-none' onChange={change} autoComplete="off" />
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
                  <div className='mt-5 flex gap-1 p-1 items-center'>
                  <label>Gender:</label>
                  <select name="gender" onChange={change} value={form.gender} className='border-2 p-1'>
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                  <div className='w-full p-1 mt-5'>
                    <label htmlFor="mailID" >Your E-Mail Id</label>
                    <input type="email" name="mailID" id='mailID' value={form.mailID} placeholder='Enter Your Mail Id' required className='w-[100%] border-[1px] p-1 outline-none' onChange={change} autoComplete="off"/>
                  </div>

                  <div className='w-full p-1 mt-5'>
                    <label htmlFor="password" >Your Password</label>
                    <input type="password" name="password" value={form.password}  id='password' placeholder='Enter Your Password' required className='w-[100%] border-[1px] p-1 outline-none'onChange={change} autoComplete="off"/>
                    <Link className='text-[var(--primary--color)] font-extrabold mt-[20px] text-[13px]'>Forget Password?</Link>
                  </div>

                  <div className='w-full p-1 mt-5'>
                    <label htmlFor="mobile" >Your Mobile Number</label>
                    <input type="text" name="mobileNumber" id='mobileNumber' value={form.mobileNumber} placeholder='Enter Your Mobile Number' required className='w-[100%] border-[1px] p-1 outline-none'onChange={change}autoComplete="off" />
                  </div>

                  <div className='w-full p-1 mt-5'>
                    <label htmlFor="mobile" >Select Your Service Providing</label><br />
                        <div className='flex gap-3'>
                          {categories.map((cat) => (
                              <div key={cat.categoryId} className='flex gap-3'>
                                <label>
                                  <input type="checkbox" value={cat.categoryId} checked={selectedCategories.includes(cat.categoryId)} onChange={(e) => { 
                                    const id = cat.categoryId;
                                      if (e.target.checked) {
                                        setSelectedCategories([...selectedCategories, id]);
                                      } else {
                                        setSelectedCategories(selectedCategories.filter((c) => c !== id));
                                      }
                                    }}
                                  />
                                  {cat.categoryName}
                                </label>
                              </div>
                             ))}

                        </div>
                  </div>
                    
                </div>
                <div className="h-full  p-2">
                  <div className='w-full  grid grid-cols-2'>
                      <div className='w-full p-1 mt-5'>
                        <label htmlFor="exp" >Year Of Experience</label>
                        <input type="number" name="exp" id='exp' onChange={change} placeholder='Enter Your Year Of Experience' required className='w-[100%] border-[1px] p-1 outline-none'autoComplete="off" />
                      </div>
                      <div className='w-full p-1 mt-5'>
                        <label htmlFor="package" >Your Package In Hrs</label>
                        <input type="number" step="0.01" name="package" id='package' onChange={change} placeholder='Enter Your Your Package In Hrs' required className='w-[100%] border-[1px] p-1 outline-none'autoComplete="off" />
                      </div>
                    </div>
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

export default ServiceProfilesetup