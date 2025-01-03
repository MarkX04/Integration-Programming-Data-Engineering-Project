// import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
// import React, { useState, useEffect } from 'react';

// interface ChannelOverviewProps {
//   channelID: string;
// }

// const ChannelOverview: React.FC<ChannelOverviewProps> = ({ channelID }) => {
//   const [channelData, setChannelData] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');

//   useEffect(() => {
//     // Fetch the data for the channel when the component mounts
//     const fetchChannelData = async () => {
//       try {
//         const response = await fetch(`https://api.example.com/channel/${channelID}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch channel data');
//         }
//         const data = await response.json();
//         setChannelData(data);
//       } catch (err) {
//         setError('Error fetching channel data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChannelData();
//   }, [channelID]);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centered}>
//         <Text>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Render channel data here */}
//       <Text>Channel ID: {channelID}</Text>
//       <Text>Channel Name: {channelData.name}</Text>
//       <Text>Description: {channelData.description}</Text>
//       {/* Add more details as needed */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ChannelOverview;
