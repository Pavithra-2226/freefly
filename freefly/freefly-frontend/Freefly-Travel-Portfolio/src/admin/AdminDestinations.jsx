
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TAMIL_NADU_DESTINATIONS = [
        {
          name: "Ooty",
          country: "India",
          category: "Hill Station",
          description: "Discover Ooty, the Queen of the Nilgiris, where rolling tea gardens, mist-covered mountains and peaceful lakes create a refreshing hill-station escape. Explore scenic viewpoints, beautifully maintained gardens and the charm of the Nilgiri Mountain Railway.",
          image: "https://static.toiimg.com/thumb/msid-91006682%2Cwidth-748%2Cheight-499%2Cresizemode%3D4%2Cimgsize-166634/Ooty-Tamil-Nadu.jpg",
          best_time_to_visit: "October to June",
          places: [
            { name: "Doddabetta Peak", image: "https://upload.wikimedia.org/wikipedia/commons/2/26/Ooty_-_Tea_plantation%2C_Doddabetta_Tamil_Nadu%2C_India.jpg", description: "Enjoy sweeping views of the Nilgiri hills from one of the region's best-known viewpoints." },
            { name: "Ooty Lake", image: "https://ttdconline.com/assets/img/boathouse/ooty/list/ooty-bh-0.png", description: "Spend a relaxing afternoon beside the lake or enjoy a boat ride surrounded by green hills." },
            { name: "Government Botanical Garden", image: "https://www.travel2ooty.com/pageimages/Botanical-Garden.jpg", description: "Explore colourful flower beds, lawns and tree-lined walking paths in this historic garden." }
          ],
          things_to_do: [
            { name: "Ride the Nilgiri Mountain Railway", image: "https://images.herzindagi.info/image/2023/Dec/ooty-the-archies.jpg", description: "Take a memorable toy-train journey through tunnels, bridges and beautiful mountain scenery." },
            { name: "Explore the Tea Gardens", image: "https://travel2ooty.s3.ap-south-1.amazonaws.com/tea-garden-hero.webp", description: "Walk through lush tea estates and enjoy the cool mountain air and plantation views." },
            { name: "Enjoy Lake Boating", image: "https://upload.wikimedia.org/wikipedia/commons/3/37/Honeymoon_Boathouse_ooty.jpg", description: "Enjoy a peaceful boating experience at the popular Ooty Lake." }
          ],
          gallery: ["https://upload.wikimedia.org/wikipedia/commons/2/26/Ooty_-_Tea_plantation%2C_Doddabetta_Tamil_Nadu%2C_India.jpg", "https://ttdconline.com/assets/img/boathouse/ooty/list/ooty-bh-0.png", "https://www.travel2ooty.com/pageimages/Botanical-Garden.jpg"],
          status: "active"
        },
        {
          name: "Kodaikanal",
          country: "India",
          category: "Hill Station",
          description: "Escape to Kodaikanal, the Princess of Hill Stations, known for its cool climate, wooded slopes, scenic valleys and the star-shaped Kodai Lake. Enjoy peaceful nature walks, viewpoints and waterfalls in the Palani Hills.",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kodaikanal%20Lake%2C%20Tamil%20Nadu.jpg",
          best_time_to_visit: "April to June and September to October",
          places: [
            { name: "Kodaikanal Lake", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kodaikanal%20Lake%2C%20Tamil%20Nadu.jpg", description: "Walk or cycle around the star-shaped lake, or enjoy boating in the heart of Kodaikanal." },
            { name: "Coaker's Walk", image: "https://commons.wikimedia.org/wiki/Special:FilePath/View%20of%20Kodaikanal%20lake%2C%20Tamil%20Nadu%20India.jpg", description: "Take a scenic stroll along this mountain pathway with wide views over the valleys." },
            { name: "Pillar Rocks", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kodaikanal%20hill%20and%20lake.jpeg", description: "See the striking granite pillars rising above the green valley and forest landscape." }
          ],
          things_to_do: [
            { name: "Go Boating", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kodaikanal%20Lake%2C%20Tamil%20Nadu.jpg", description: "Enjoy a relaxing boat ride and admire the hills around Kodai Lake." },
            { name: "Walk Through Pine Forest", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kodaikanal%20hill%20and%20lake.jpeg", description: "Explore the tall pine trees and peaceful forest paths that make Kodaikanal special." },
            { name: "Visit Scenic Viewpoints", image: "https://commons.wikimedia.org/wiki/Special:FilePath/View%20of%20Kodaikanal%20lake%2C%20Tamil%20Nadu%20India.jpg", description: "Stop at viewpoints for misty valley scenery and memorable photographs." }
          ],
          gallery: ["https://commons.wikimedia.org/wiki/Special:FilePath/Kodaikanal%20Lake%2C%20Tamil%20Nadu.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/View%20of%20Kodaikanal%20lake%2C%20Tamil%20Nadu%20India.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Kodaikanal%20hill%20and%20lake.jpeg"],
          status: "active"
        },
        {
          name: "Madurai",
          country: "India",
          category: "Heritage",
          description: "Experience Madurai, one of Tamil Nadu's historic cultural centres. The city is celebrated for the magnificent Meenakshi Amman Temple, lively traditional markets, distinctive architecture and its rich food and festival culture.",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi%20Amman%20Temple%2C%20Madurai.jpg",
          best_time_to_visit: "October to March",
          places: [
            { name: "Meenakshi Amman Temple", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi%20Amman%20Temple%2C%20Madurai.jpg", description: "Admire the famous temple complex, its colourful towers and detailed Dravidian architecture." },
            { name: "Thirumalai Nayakkar Palace", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Madurai%20Meenakshi%20Amman%20Temple.JPG", description: "Discover the grand pillars and historic architecture of this 17th-century palace." },
            { name: "Gandhi Memorial Museum", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi%20Amman%20Temple%2C%20Madurai.jpg", description: "Learn about India's freedom movement through exhibits and historical displays." }
          ],
          things_to_do: [
            { name: "Explore the Temple Streets", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi%20Amman%20Temple%2C%20Madurai.jpg", description: "Walk around the temple streets and browse traditional shops and local markets." },
            { name: "Taste Madurai Cuisine", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Madurai%20Meenakshi%20Amman%20Temple.JPG", description: "Try local favourites and experience the city's lively food culture." },
            { name: "Discover Heritage Architecture", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi%20Amman%20Temple%2C%20Madurai.jpg", description: "Spend time exploring the city's historic buildings and distinctive temple architecture." }
          ],
          gallery: ["https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi%20Amman%20Temple%2C%20Madurai.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Madurai%20Meenakshi%20Amman%20Temple.JPG"],
          status: "active"
        },
        {
          name: "Rameswaram",
          country: "India",
          category: "Temple",
          description: "Visit Rameswaram, a beautiful island destination known for its sacred Ramanathaswamy Temple, long temple corridors, coastal landscapes and the iconic Pamban Bridge. It offers a memorable blend of spirituality, history and seaside scenery.",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rameswaram%20pamban%20bridge.jpg",
          best_time_to_visit: "October to April",
          places: [
            { name: "Ramanathaswamy Temple", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rameswaram%20pamban%20bridge.jpg", description: "Visit the renowned temple, known for its long pillared corridors and sacred significance." },
            { name: "Pamban Bridge", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rameswaram%20bridge%20Pamban%20bridge.jpg", description: "See the famous bridge connecting the island region with mainland Tamil Nadu." },
            { name: "Dhanushkodi", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pamban%20Bridge%2C%20Rameswaram.jpg", description: "Explore the dramatic coastal landscape and the remains of the old settlement at the island's tip." }
          ],
          things_to_do: [
            { name: "Explore the Temple Corridors", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rameswaram%20pamban%20bridge.jpg", description: "Experience the architecture and atmosphere of the famous Ramanathaswamy Temple." },
            { name: "Visit Dhanushkodi Beach", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pamban%20Bridge%2C%20Rameswaram.jpg", description: "Enjoy the sea views and unique coastal setting at Dhanushkodi." },
            { name: "View Pamban Bridge", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rameswaram%20bridge%20Pamban%20bridge.jpg", description: "Take in the striking sea-bridge views and photograph this famous landmark." }
          ],
          gallery: ["https://commons.wikimedia.org/wiki/Special:FilePath/Rameswaram%20pamban%20bridge.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Rameswaram%20bridge%20Pamban%20bridge.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Pamban%20Bridge%2C%20Rameswaram.jpg"],
          status: "active"
        },
        {
          name: "Kanyakumari",
          country: "India",
          category: "Beach",
          description: "Discover Kanyakumari at the southern tip of mainland India, where the Arabian Sea, Bay of Bengal and Indian Ocean meet. The destination is loved for its sunrise and sunset views, Vivekananda Rock Memorial and coastal atmosphere.",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/Vivekananda%20Rock%20Memorial%2C%20Kanyakumari.jpg",
          best_time_to_visit: "October to March",
          places: [
            { name: "Vivekananda Rock Memorial", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Vivekananda%20Rock%20Memorial%2C%20Kanyakumari.jpg", description: "Take a ferry to the memorial on the rock and enjoy the panoramic ocean setting." },
            { name: "Thiruvalluvar Statue", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Vivekananda%20Rock%20Memorial%2C%20Kanyakumari%2C%20Tamil%20Nadu%2C%20India.jpg", description: "See the monumental statue honouring the celebrated Tamil poet and philosopher Thiruvalluvar." },
            { name: "Kanyakumari Beach", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Vivekananda%20Rock%20Memorial%2C%20Kanyakumari%2C%20Tamil%20Nadu.jpg", description: "Enjoy the coastal views and the famous sunrise and sunset atmosphere." }
          ],
          things_to_do: [
            { name: "Watch the Sunrise", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Vivekananda%20Rock%20Memorial%2C%20Kanyakumari.jpg", description: "Start the day by watching the sun rise over the ocean horizon." },
            { name: "Take a Ferry Ride", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Vivekananda%20Rock%20Memorial%2C%20Kanyakumari%2C%20Tamil%20Nadu%2C%20India.jpg", description: "Travel by ferry to visit the offshore memorial and enjoy the sea views." },
            { name: "Explore the Seafront", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Vivekananda%20Rock%20Memorial%2C%20Kanyakumari%2C%20Tamil%20Nadu.jpg", description: "Walk along the waterfront and enjoy the distinctive southern coastal scenery." }
          ],
          gallery: ["https://commons.wikimedia.org/wiki/Special:FilePath/Vivekananda%20Rock%20Memorial%2C%20Kanyakumari.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Vivekananda%20Rock%20Memorial%2C%20Kanyakumari%2C%20Tamil%20Nadu%2C%20India.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Vivekananda%20Rock%20Memorial%2C%20Kanyakumari%2C%20Tamil%20Nadu.jpg"],
          status: "active"
        },
        {
          name: "Mahabalipuram",
          country: "India",
          category: "Heritage",
          description: "Explore Mahabalipuram, a coastal heritage town famous for its Pallava-era rock-cut monuments, carved stone temples and Shore Temple overlooking the Bay of Bengal. It is an excellent destination for history, architecture and seaside visits.",
          image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shore%20Temple%2C%20Mahabalipuram%2C%20Tamil%20Nadu.jpg",
          best_time_to_visit: "November to February",
          places: [
            { name: "Shore Temple", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shore%20Temple%2C%20Mahabalipuram%2C%20Tamil%20Nadu.jpg", description: "Visit the landmark granite temple standing beside the Bay of Bengal." },
            { name: "Pancha Rathas", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shore%20Temple%20at%20Mahabalipuram%20Tamilnadu.jpg", description: "Discover the remarkable group of monolithic rock-cut monuments carved from single stones." },
            { name: "Arjuna's Penance", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mahabalipuram%20Shore%20Temple.jpg", description: "Admire the enormous open-air rock relief filled with detailed sculptural scenes." }
          ],
          things_to_do: [
            { name: "Explore the Shore Temple", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shore%20Temple%2C%20Mahabalipuram%2C%20Tamil%20Nadu.jpg", description: "Walk around the historic temple complex and enjoy its coastal setting." },
            { name: "Discover the Stone Carvings", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shore%20Temple%20at%20Mahabalipuram%20Tamilnadu.jpg", description: "Look closely at the detailed carvings and ancient rock-cut architecture." },
            { name: "Relax by the Beach", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mahabalipuram%20Shore%20Temple.jpg", description: "Spend some time along the coast after exploring the heritage monuments." }
          ],
          gallery: ["https://commons.wikimedia.org/wiki/Special:FilePath/Shore%20Temple%2C%20Mahabalipuram%2C%20Tamil%20Nadu.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Shore%20Temple%20at%20Mahabalipuram%20Tamilnadu.jpg", "https://commons.wikimedia.org/wiki/Special:FilePath/Mahabalipuram%20Shore%20Temple.jpg"],
          status: "active"
        }
      ];

function AdminDestinations() {
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormData = {
    name: "",
    country: "India",
    category: "",
    description: "",
    image: "",
    best_time_to_visit: "",
    places: [],
    things_to_do: [],
    gallery: [],
    status: "active",
  };

  const [formData, setFormData] = useState(initialFormData);

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({ ...initialFormData });
    setEditingId(null);
  };

  // =====================================================
  // GET DESTINATIONS
  // =====================================================

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");

      if (!token) {
        console.error("Admin token not found.");
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/destinations",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load destinations");
      }

      setDestinations(data);
    } catch (error) {
      console.error("Destination error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Replace all existing destination records with the six curated Tamil Nadu destinations.
  const handleReplaceWithTamilNadu = async () => {
    const confirmed = window.confirm(
      "This will permanently delete ALL existing destinations and replace them with Ooty, Kodaikanal, Madurai, Rameswaram, Kanyakumari and Mahabalipuram. Continue?"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("admin_token");
    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      setLoading(true);

      const currentResponse = await fetch(
        "http://127.0.0.1:8000/api/admin/destinations",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const currentItems = await currentResponse.json();

      if (!currentResponse.ok) {
        throw new Error(currentItems.detail || "Could not load existing destinations.");
      }

      for (const item of currentItems) {
        const deleteResponse = await fetch(
          `http://127.0.0.1:8000/api/admin/destinations/${item.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!deleteResponse.ok) {
          const errorData = await deleteResponse.json();
          throw new Error(errorData.detail || `Could not delete ${item.name}.`);
        }
      }

      const createdItems = [];
      for (const destination of TAMIL_NADU_DESTINATIONS) {
        const createResponse = await fetch(
          "http://127.0.0.1:8000/api/admin/destinations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(destination),
          }
        );
        const created = await createResponse.json();
        if (!createResponse.ok) {
          throw new Error(created.detail || `Could not create ${destination.name}.`);
        }
        createdItems.push(created);
      }

      setDestinations(createdItems);
      alert("Successfully replaced your destination list with six Tamil Nadu destinations.");
    } catch (error) {
      console.error("Destination reset error:", error);
      alert(error.message || "Could not replace destinations.");
      await fetchDestinations();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // EDIT DESTINATION
  // =====================================================

  const handleEdit = (destination) => {
    setEditingId(destination.id);

    setFormData({
      name: destination.name || "",
      country: destination.country || "",
      category: destination.category || "",
      description: destination.description || "",
      image: destination.image || "",
      best_time_to_visit: destination.best_time_to_visit || "",
      places: destination.places || [],
      things_to_do: destination.things_to_do || [],
      gallery: destination.gallery || [],
      status: destination.status || "active",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE DESTINATION
  // =====================================================

  const handleDelete = async (destinationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this destination?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/destinations/${destinationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete destination"
        );
      }

      alert("Destination deleted successfully!");

      await fetchDestinations();
    } catch (error) {
      console.error("Delete destination error:", error);
      alert(error.message);
    }
  };

  // =====================================================
  // ENABLE / DISABLE DESTINATION
  // =====================================================

  const handleStatusChange = async (destination) => {
    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const newStatus =
        destination.status === "active"
          ? "inactive"
          : "active";

      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/destinations/${destination.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update destination status"
        );
      }

      alert(
        newStatus === "active"
          ? "Destination enabled!"
          : "Destination disabled!"
      );

      await fetchDestinations();
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.message);
    }
  };

  // =====================================================
  // TOP PLACES
  // =====================================================

  const addPlace = () => {
    setFormData((previous) => ({
      ...previous,
      places: [
        ...previous.places,
        {
          name: "",
          image: "",
          description: "",
        },
      ],
    }));
  };

  const updatePlace = (index, field, value) => {
    setFormData((previous) => {
      const updatedPlaces = [...previous.places];

      updatedPlaces[index] = {
        ...updatedPlaces[index],
        [field]: value,
      };

      return {
        ...previous,
        places: updatedPlaces,
      };
    });
  };

  const removePlace = (index) => {
    setFormData((previous) => ({
      ...previous,
      places: previous.places.filter(
        (_, placeIndex) => placeIndex !== index
      ),
    }));
  };

  // =====================================================
  // THINGS TO DO
  // =====================================================

  const addActivity = () => {
    setFormData((previous) => ({
      ...previous,
      things_to_do: [
        ...previous.things_to_do,
        {
          name: "",
          image: "",
          description: "",
        },
      ],
    }));
  };

  const updateActivity = (index, field, value) => {
    setFormData((previous) => {
      const updatedActivities = [...previous.things_to_do];

      updatedActivities[index] = {
        ...updatedActivities[index],
        [field]: value,
      };

      return {
        ...previous,
        things_to_do: updatedActivities,
      };
    });
  };

  const removeActivity = (index) => {
    setFormData((previous) => ({
      ...previous,
      things_to_do: previous.things_to_do.filter(
        (_, activityIndex) => activityIndex !== index
      ),
    }));
  };

  // =====================================================
  // GALLERY
  // =====================================================

  const addGalleryImage = () => {
    setFormData((previous) => ({
      ...previous,
      gallery: [...previous.gallery, ""],
    }));
  };

  const updateGalleryImage = (index, value) => {
    setFormData((previous) => {
      const updatedGallery = [...previous.gallery];
      updatedGallery[index] = value;

      return {
        ...previous,
        gallery: updatedGallery,
      };
    });
  };

  const removeGalleryImage = (index) => {
    setFormData((previous) => ({
      ...previous,
      gallery: previous.gallery.filter(
        (_, galleryIndex) => galleryIndex !== index
      ),
    }));
  };

  // =====================================================
  // ADD / UPDATE DESTINATION
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        alert("Please login again.");
        return;
      }

      const url = editingId
        ? `http://127.0.0.1:8000/api/admin/destinations/${editingId}`
        : "http://127.0.0.1:8000/api/admin/destinations";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to save destination"
        );
      }

      alert(
        editingId
          ? "Destination updated successfully!"
          : "Destination added successfully!"
      );

      resetForm();
      setShowForm(false);

      await fetchDestinations();
    } catch (error) {
      console.error("Destination save error:", error);
      alert(error.message);
    }
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const handleCloseForm = () => {
    resetForm();
    setShowForm(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin");
  };

  // =====================================================
  // REUSABLE FORM FIELD
  // =====================================================

  const renderInput = (
    label,
    name,
    placeholder,
    required = false
  ) => (
    <div className="ff-field">
      <label>{label}</label>
      <input
        type="text"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  const renderTextArea = (
    label,
    name,
    placeholder,
    rows = 4,
    required = false
  ) => (
    <div className="ff-field">
      <label>{label}</label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
      />
    </div>
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="ff-admin-layout">

      {/* SIDEBAR */}

      <aside className="ff-sidebar">
        <div className="ff-logo">
          <div className="ff-logo-icon">✈</div>
          <span>
            Freefly<span style={{ color: "#60a5fa" }}>.</span>
          </span>
        </div>

        <p className="ff-sidebar-label">MAIN MENU</p>

        <nav className="ff-sidebar-nav">
          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            type="button"
            className="ff-nav-item active"
            onClick={() => navigate("/admin/destinations")}
          >
            <span>◎</span>
            Destinations
          </button>

          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/packages")}
          >
            <span>▣</span>
            Packages
          </button>

          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/enquiries")}
          >
            <span>✉</span>
            Enquiries
          </button>

          <button
            type="button"
            className="ff-nav-item"
            onClick={() => navigate("/admin/offers")}
          >
            <span>◇</span>
            Offers
          </button>
        </nav>

        <div className="ff-sidebar-bottom">
          <div className="ff-sidebar-travel">
            <span>🌍</span>
            <div>
              <strong>Explore the world</strong>
              <small>Manage your travel experience</small>
            </div>
          </div>

          <button
            type="button"
            className="ff-logout"
            onClick={handleLogout}
          >
            ↪ <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="ff-main">

        {/* TOPBAR */}

       

        <div className="ff-destinations-content">
          <div className="ff-destinations-inner">

            {/* PAGE HEADER */}

            <div className="ff-destination-heading">
              <div>
                <span className="ff-eyebrow">
                  TRAVEL CONTENT
                </span>

                <h1>Manage Destinations</h1>

                <p>
                  Add, edit, enable, disable, or delete your
                  travel destinations.
                </p>
              </div>

              <div className="ff-destination-heading-actions" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="ff-outline-btn"
                  onClick={handleReplaceWithTamilNadu}
                  disabled={loading}
                  title="Deletes all existing destinations and loads the six prepared Tamil Nadu destinations"
                >
                  Replace All with 6 Tamil Nadu Places
                </button>
                <button
                  type="button"
                  className="ff-primary-btn"
                  onClick={() => {
                    if (showForm) {
                      handleCloseForm();
                    } else {
                      resetForm();
                      setShowForm(true);
                    }
                  }}
                >
                  {showForm ? "✕ Close Form" : "+ Add Destination"}
                </button>
              </div>
            </div>

            {/* ADD / EDIT FORM */}

            {showForm && (
              <section className="ff-destination-form-card">

                <div className="ff-form-heading">
                  <div>
                    <span className="ff-eyebrow">
                      DESTINATION DETAILS
                    </span>

                    <h2>
                      {editingId
                        ? "Edit Destination"
                        : "Add New Destination"}
                    </h2>

                    <p>
                      Enter the destination information below.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>

                  {/* BASIC INFORMATION */}

                  <div className="ff-form-section">
                    <div className="ff-form-section-heading">
                      <span>01</span>
                      <div>
                        <h3>Basic Information</h3>
                        <p>Main destination details</p>
                      </div>
                    </div>

                    <div className="ff-form-grid">
                      {renderInput(
                        "Destination Name",
                        "name",
                        "Example: Ooty",
                        true
                      )}

                      {renderInput(
                        "Country",
                        "country",
                        "Example: India",
                        true
                      )}

                      <div className="ff-field">
                        <label>Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="Hill Station">Hill Station</option>
                          <option value="Beach">Beach</option>
                          <option value="Heritage">Heritage</option>
                          <option value="Temple">Temple</option>
                          <option value="Nature">Nature</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Wildlife">Wildlife</option>
                        </select>
                      </div>

                      <div className="ff-field">
                        <label>Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="ff-form-full-field">
                      {renderInput(
                        "Main Image URL",
                        "image",
                        "https://example.com/destination.jpg",
                        true
                      )}
                    </div>

                    <div className="ff-form-full-field">
                      {renderTextArea(
                        "Description",
                        "description",
                        "Enter destination description...",
                        4,
                        true
                      )}
                    </div>
                  </div>

                  {/* BEST TIME */}

                  <div className="ff-form-section">
                    <div className="ff-form-section-heading">
                      <span>02</span>
                      <div>
                        <h3>Best Time to Visit</h3>
                        <p>Recommended travel season</p>
                      </div>
                    </div>

                    {renderInput(
                      "Best Time to Visit",
                      "best_time_to_visit",
                      "Example: April - June / September - October"
                    )}
                  </div>

                  {/* TOP PLACES */}

                  <div className="ff-form-section">
                    <div className="ff-form-section-heading ff-section-with-action">
                      <div className="ff-section-title-group">
                        <span>03</span>
                        <div>
                          <h3>Top Places to Visit</h3>
                          <p>Add famous places and attractions</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ff-outline-btn"
                        onClick={addPlace}
                      >
                        + Add Place
                      </button>
                    </div>

                    {formData.places.length === 0 ? (
                      <div className="ff-empty-section">
                        No places added yet. Click Add Place to begin.
                      </div>
                    ) : (
                      formData.places.map((place, index) => (
                        <div className="ff-repeat-card" key={index}>
                          <div className="ff-repeat-card-heading">
                            <strong>Place {index + 1}</strong>

                            <button
                              type="button"
                              className="ff-remove-btn"
                              onClick={() => removePlace(index)}
                            >
                              Remove
                            </button>
                          </div>

                          <div className="ff-form-grid">
                            <div className="ff-field">
                              <label>Place Name</label>
                              <input
                                type="text"
                                value={place.name}
                                onChange={(event) =>
                                  updatePlace(
                                    index,
                                    "name",
                                    event.target.value
                                  )
                                }
                                placeholder="Example: Eiffel Tower"
                                required
                              />
                            </div>

                            <div className="ff-field">
                              <label>Image URL</label>
                              <input
                                type="text"
                                value={place.image}
                                onChange={(event) =>
                                  updatePlace(
                                    index,
                                    "image",
                                    event.target.value
                                  )
                                }
                                placeholder="https://example.com/place.jpg"
                                required
                              />
                            </div>
                          </div>

                          <div className="ff-form-full-field">
                            <div className="ff-field">
                              <label>Description</label>
                              <textarea
                                value={place.description}
                                onChange={(event) =>
                                  updatePlace(
                                    index,
                                    "description",
                                    event.target.value
                                  )
                                }
                                placeholder="Describe this place..."
                                rows="3"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* THINGS TO DO */}

                  <div className="ff-form-section">
                    <div className="ff-form-section-heading ff-section-with-action">
                      <div className="ff-section-title-group">
                        <span>04</span>
                        <div>
                          <h3>Things to Do</h3>
                          <p>Add activities and experiences</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ff-outline-btn"
                        onClick={addActivity}
                      >
                        + Add Activity
                      </button>
                    </div>

                    {formData.things_to_do.length === 0 ? (
                      <div className="ff-empty-section">
                        No activities added yet. Click Add Activity to begin.
                      </div>
                    ) : (
                      formData.things_to_do.map((activity, index) => (
                        <div className="ff-repeat-card" key={index}>
                          <div className="ff-repeat-card-heading">
                            <strong>Activity {index + 1}</strong>

                            <button
                              type="button"
                              className="ff-remove-btn"
                              onClick={() => removeActivity(index)}
                            >
                              Remove
                            </button>
                          </div>

                          <div className="ff-form-grid">
                            <div className="ff-field">
                              <label>Activity Name</label>
                              <input
                                type="text"
                                value={activity.name}
                                onChange={(event) =>
                                  updateActivity(
                                    index,
                                    "name",
                                    event.target.value
                                  )
                                }
                                placeholder="Example: River Cruise"
                                required
                              />
                            </div>

                            <div className="ff-field">
                              <label>Image URL</label>
                              <input
                                type="text"
                                value={activity.image}
                                onChange={(event) =>
                                  updateActivity(
                                    index,
                                    "image",
                                    event.target.value
                                  )
                                }
                                placeholder="https://example.com/activity.jpg"
                                required
                              />
                            </div>
                          </div>

                          <div className="ff-form-full-field">
                            <div className="ff-field">
                              <label>Description</label>
                              <textarea
                                value={activity.description}
                                onChange={(event) =>
                                  updateActivity(
                                    index,
                                    "description",
                                    event.target.value
                                  )
                                }
                                placeholder="Describe this activity..."
                                rows="3"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* GALLERY */}

                  <div className="ff-form-section">
                    <div className="ff-form-section-heading ff-section-with-action">
                      <div className="ff-section-title-group">
                        <span>05</span>
                        <div>
                          <h3>Destination Gallery</h3>
                          <p>Add additional destination images</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ff-outline-btn"
                        onClick={addGalleryImage}
                      >
                        + Add Gallery Image
                      </button>
                    </div>

                    {formData.gallery.length === 0 ? (
                      <div className="ff-empty-section">
                        No gallery images added yet.
                      </div>
                    ) : (
                      formData.gallery.map((image, index) => (
                        <div className="ff-gallery-input-row" key={index}>
                          <div className="ff-field">
                            <label>Gallery Image {index + 1}</label>
                            <input
                              type="text"
                              value={image}
                              onChange={(event) =>
                                updateGalleryImage(
                                  index,
                                  event.target.value
                                )
                              }
                              placeholder="https://example.com/gallery.jpg"
                              required
                            />
                          </div>

                          <button
                            type="button"
                            className="ff-remove-btn"
                            onClick={() => removeGalleryImage(index)}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* FORM ACTIONS */}

                  <div className="ff-form-actions">
                    <button
                      type="button"
                      className="ff-cancel-btn"
                      onClick={handleCloseForm}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="ff-primary-btn"
                    >
                      {editingId
                        ? "Update Destination"
                        : "Save Destination"}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* DESTINATION LIST */}

            <div className="ff-destination-list-heading">
              <div>
                <h2>All Destinations</h2>
                <p>
                  Your destination collection
                </p>
              </div>

              <span className="ff-destination-count">
                {destinations.length} Destinations
              </span>
            </div>

            {loading ? (
              <div className="ff-destination-empty">
                <div className="ff-loading-spinner"></div>
                <p>Loading destinations...</p>
              </div>
            ) : destinations.length === 0 ? (
              <div className="ff-destination-empty">
                <div className="ff-empty-icon">🌍</div>
                <h3>No destinations found</h3>
                <p>Add your first destination to get started.</p>

                <button
                  type="button"
                  className="ff-primary-btn"
                  onClick={() => setShowForm(true)}
                >
                  + Add Destination
                </button>
              </div>
            ) : (
              <div className="ff-destination-grid">
                {destinations.map((destination) => (
                  <article
                    className="ff-destination-card"
                    key={destination.id}
                  >
                    <div className="ff-destination-image">
                      <img
                        src={destination.image}
                        alt={destination.name}
                      />

                      <span
                        className={
                          destination.status === "active"
                            ? "ff-status-badge active"
                            : "ff-status-badge inactive"
                        }
                      >
                        <span className="ff-status-dot"></span>
                        {destination.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="ff-destination-card-body">
                      <div className="ff-destination-card-top">
                        <span className="ff-category-badge">
                          {destination.category}
                        </span>
                      </div>

                      <h3>{destination.name}</h3>

                      <p className="ff-destination-country">
                        <span>📍</span>
                        {destination.country}
                      </p>

                      <p className="ff-destination-description">
                        {destination.description}
                      </p>

                      <div className="ff-destination-card-footer">
                        <button
                          type="button"
                          className="ff-card-edit-btn"
                          onClick={() => handleEdit(destination)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="ff-card-delete-btn"
                          onClick={() => handleDelete(destination.id)}
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          className="ff-card-status-btn"
                          onClick={() => handleStatusChange(destination)}
                        >
                          {destination.status === "active"
                            ? "Disable"
                            : "Enable"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="ff-destination-footer">
              Freefly Admin Panel · Destination Management
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDestinations;
