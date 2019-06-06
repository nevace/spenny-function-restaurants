const Firestore = require('@google-cloud/firestore');
const fetch = require('node-fetch');

const firestore = new Firestore({ projectId: 'spennyapp' });

async function getRestaurants() {
  try {
    const restaurants = await firestore.collectionGroup('restaurants').get();

    restaurants.forEach(async restaurant => {
      try {
        const restaurantData = await getRestaurantData(restaurant.get('zomatoId'));

        updateFirestore(restaurant.id, restaurantData);
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

async function getRestaurantData(id) {
  try {
    const res = await fetch(`https://developers.zomato.com/api/v2.1/restaurant?res_id=${id}`, {
      headers: { 'user-key': '14421c898fe8a43db3afaeaa23c04e9b' }
    });

    if (res.ok) {
      return await res.json();
    } else {
      return Promise.reject(res);
    }
  } catch (err) {
    return Promise.reject(err);
  }
}

function updateFirestore(id, data) {
  const restaurantData = {
    name: data.name,
    location: {
      address: data.location.address,
      locality: data.location.locality,
      localityVerbose: data.location.locality_verbose,
      city: data.location.city,
      geo: new Firestore.GeoPoint(parseFloat(data.location.latitude), parseFloat(data.location.longitude)),
      postcode: data.location.zipcode
    },
    priceRange: data.price_range,
    thumbnail: data.thumb,
    featuredImage: data.featured_image,
    cuisines: data.cuisines ? data.cuisines.split() : '',
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    firestore
      .collection('restaurants')
      .doc(id)
      .set(restaurantData, { merge: true });
  } catch (err) {
    console.error(err);
  }
}

exports.main = () => getRestaurants();
