import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const GetAQuote = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    mobile: "",
    email: "",
    industry: "",
    service: "",
    project: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://servora-main-prod.onrender.com/api/contact", formData);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      setFormData({
        name: "",
        company: "",
        mobile: "",
        email: "",
        industry: "",
        service: "",
        project: "",
      });
    } catch (error) {
      console.error(error);
    //   alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="getaquote">
      <div className="relative">
        <img
          src="https://images.pexels.com/photos/3228766/pexels-photo-3228766.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=750&amp;w=1260"
          className="absolute inset-0 object-cover w-full h-full min-h-[420px] sm:min-h-[520px]"
          alt=""
        />
        {/* <div className="relative opacity-75 custom-gradient"> */}
        <div className="relative">
          <div className="absolute inset-0 custom-gradient opacity-75"></div>
          <div className="absolute inset-x-0 bottom-0 overflow-hidden leading-[0]">
            <svg
              className="block translate-y-px w-full h-auto fix-antialiasing "
              viewBox="0 0 1160 160"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#ffffff"
                d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 1216 7.7L1276 13V160H1216C1156 160 1036 160 916 160C796 160 676 160 556 160C436 160 316 160 196 160C76 160 -44 160 -104 160H-164V13Z"
              />
            </svg>
          </div>

          <div className="relative px-2 sm:px-4 py-10 sm:py-16 mx-auto overflow-hidden max-w-full sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-8 lg:py-20">
            <div className="flex flex-col items-center justify-between gap-10 xl:flex-row">
              <div className="w-full max-w-xl mb-8 sm:mb-12 xl:mb-0 xl:pr-16 xl:w-7/12">
                <h2 className="max-w-lg mb-4 sm:mb-6 font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
                  Ready to Bring Your Perfect{" "}
                  <br className="hidden md:block" />
                  Custom Outfit to Life?
                </h2>
                <p className="max-w-xl mb-3 sm:mb-4 text-sm sm:text-base text-gray-200 md:text-lg">
                  Whether you have a design in mind or need expert guidance,
                  our skilled tailors are here to create bespoke clothing that
                  fits you perfectly. Let's craft something exceptional—together.
                </p>
                <Link
                  to="/"
                  aria-label=""
                  className="inline-flex items-center font-semibold tracking-wider transition-colors duration-200 text-orange-300 hover:text-orange-100 text-sm sm:text-base"
                >
                  Let's Create
                  <svg
                    className="inline-block w-3 ml-2"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
                  </svg>
                </Link>
              </div>
              <div className="w-full max-w-xl xl:w-50">
                <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8">
                  <h3 className="mb-2 text-xl sm:text-2xl font-extrabold text-center text-gray-800">
                    Let's Craft Your Perfect Fit
                  </h3>
                  <p className="text-xs sm:text-sm text-center text-gray-500 mb-4 sm:mb-6">
                    Fill out the form, we'll create a custom tailoring solution
                    just for you.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block mb-1 font-medium text-gray-700 text-xs sm:text-sm"
                        >
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Nice to meet you!"
                          required
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Company */}
                      <div>
                        <label
                          htmlFor="company"
                          className="block mb-1 font-medium text-gray-700 text-xs sm:text-sm"
                        >
                          Occasion/Event
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Wedding, business, casual..."
                          required
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Mobile */}
                      <div>
                        <label
                          htmlFor="mobile"
                          className="block mb-1 font-medium text-gray-700 text-xs sm:text-sm"
                        >
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          id="mobile"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="We'd love to discuss details"
                          required
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-1 font-medium text-gray-700 text-xs sm:text-sm"
                        >
                          Your Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="For your fitting schedule"
                          required
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200 text-xs sm:text-sm"
                        />
                      </div>

                      {/* Industry */}
                      <div>
                        <label
                          htmlFor="industry"
                          className="block mb-1 font-medium text-gray-700 text-xs sm:text-sm"
                        >
                          Garment Type
                        </label>
                        <select
                          id="industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          required
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-xs sm:text-sm"
                        >
                          <option value="">Choose garment type</option>
                          <option value="suits">Suits & Blazers</option>
                          <option value="shirts">Shirts & Blouses</option>
                          <option value="dresses">Dresses & Gowns</option>
                          <option value="pants">Pants & Trousers</option>
                          <option value="traditional">Traditional Wear</option>
                          <option value="alterations">Alterations</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Service */}
                      <div>
                        <label
                          htmlFor="service"
                          className="block mb-1 font-medium text-gray-700 text-xs sm:text-sm"
                        >
                          What Service Do You Need?
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          required
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200 text-xs sm:text-sm"
                        >
                          <option value="">Choose a service</option>
                          <option value="custom-tailoring">
                            Custom Tailoring
                          </option>
                          <option value="alterations">Alterations & Fitting</option>
                          <option value="design-consultation">
                            Design Consultation
                          </option>
                          <option value="measurements">Measurements & Styling</option>
                          <option value="repairs">Repairs & Maintenance</option>
                        </select>
                      </div>
                    </div>

                    {/* Project Message - full width */}
                    <div className="mt-3 sm:mt-4">
                      <label
                        htmlFor="project"
                        className="block mb-1 font-medium text-gray-700 text-xs sm:text-sm"
                      >
                        Tell Us About Your Vision
                      </label>
                      <textarea
                        id="project"
                        name="project"
                        value={formData.project}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Describe your style preferences, fabric choices, or any specific requirements..."
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-xs sm:text-sm"
                      />
                    </div>

                    {/* Submit */}
                    <div className="mt-4 sm:mt-6 mb-3 sm:mb-4">
                      <button
                        type="submit"
                        className="w-full h-10 sm:h-12 px-4 font-semibold tracking-wide text-white bg-gradient-to-r from-orange-400 to-orange-300 rounded-full shadow-md hover:scale-105 transition-transform duration-200 text-xs sm:text-base"
                      >
                        Get My Custom Quote
                      </button>
                    </div>

                    <p className="text-[11px] sm:text-xs text-center text-gray-500">
                      Professional tailoring with attention to detail and
                      perfect fit guaranteed.
                    </p>
                  </form>
                  {showPopup && (
                    <div className="fixed top-4 right-2 sm:right-6 bg-white border border-orange-300 shadow-xl rounded-xl px-4 sm:px-6 py-3 sm:py-4 z-[999999] animate-fade-in-up max-w-[90vw] sm:max-w-xs text-xs sm:text-base">
                      <p className="text-orange-500 font-semibold text-center">
                        Thanks for choosing us! Your custom tailoring quote is on its way!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetAQuote;