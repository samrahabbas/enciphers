export const GET_CONTACTS = 'GET_CONTACTS';
export const SEARCH_CONTACTS = 'SEARCH_CONTACTS';
import client from '../../api/client';
import {userExists} from '../../local_db/SQLite';

export const getContacts = () => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const token = getState().auth.token;
      const currentUser = getState().auth.user;
      try {
        const result = await client.get('/users', {
          headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (result.status === 200 && result.data.success === true) {
          var contacts = [];
          for (let i = 0; i < result.data.users.length; i++) {
            if (result.data.users[i].username === currentUser.username) {
            } else contacts.push(result.data.users[i]);
          }
          dispatch({
            type: GET_CONTACTS,
            contacts: contacts,
          });
          resolve(contacts);
        }
      } catch (error) {
        console.log(error.message);
        reject(error.message);
      }
    });
  };
};

export const saveContacts = () => {
  return async (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const contacts = getState().contact.contacts;
      try {
        for (let i = 0; i < contacts.length; i++) {
          userExists(contacts[i]._id, contacts[i].username, contacts[i].avatar);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
};

// export const searchContacts = query => {
//   return async (dispatch, getState) => {
//     const customers = getState().customer.customers;
//     let search = customers.filter(array =>
//       array.FirstName.toLowerCase().startsWith(query),
//     );
//     if (search.length === 0) {
//       search = customers.filter(array =>
//         array.Email.toString().toLowerCase().startsWith(query),
//       );
//     }
//     dispatch({type: SEARCH_CUSTOMER, search: search});
//   };
// };
