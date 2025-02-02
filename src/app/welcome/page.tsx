"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WelcomeForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const availableInterests = [
    "Sports",
    "Music",
    "Reading",
    "Travel",
    "Movies",
    "Technology",
    "Art",
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async () => {
    const userData = {
      username,
      country,
      city,
      interests: selectedInterests,
    };

    console.log("router", router);
    
    alert(
      `Thank you, ${username}! Your profile has been set up.\nRedirecting to the homepage...`
    );

    window.location.href = "/";
    
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Welcome</h1>
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter your country"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
              required
            />
          </div>
        </div>

        <div className="interests-container">
          <h2>Select Your Interests</h2>
          <div className="interests">
            {availableInterests.map((interest, idx) => (
              <div
                key={idx}
                className={`interest ${
                  selectedInterests.includes(interest) ? "selected" : ""
                }`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit}>Submit</button>
      </div>

      <style jsx>{`
        .container {
            min-height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at bottom right, #ff0000, #000 50%);
            padding: 1rem;
            box-sizing: border-box;
        }
        .card {
          background: #fff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 500px;
        }
        h1 {
          text-align: center;
          margin-bottom: 1rem;
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(90deg, #ff0000, #ff7f50);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }
        .form-section {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #555;
        }
        input {
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          color: #000;
          transition: border-color 0.2s ease;
        }
        input:focus {
          outline: none;
          border-color: #ff0000;
        }
        .interests-container {
          margin-top: 2rem;
        }
        .interests-container h2 {
          text-align: center;
          margin-bottom: 1rem;
          color: #333;
        }
        .interests {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }
        .interest {
          padding: 0.5rem 1rem;
          background: #eee;
          border: 1px solid #ccc;
          border-radius: 20px;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .interest.selected {
          background: #ff0000;
          border-color: #ff0000;
          color: #fff;
        }
        button {
          display: block;
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          color: #fff;
          background-color: #ff0000;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          margin-top: 2rem;
        }
        button:hover {
          background-color: #cc0000;
        }
      `}</style>
    </div>
  );
}
