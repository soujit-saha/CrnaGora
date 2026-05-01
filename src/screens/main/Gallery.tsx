import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButtonHeader from '../../component/BackButtonHeader';
import { ms, mvs } from '../../utils/helper/metric';
import { COLORS } from '../../utils/constants';

const GALLERY = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
];

const Gallery = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <SafeAreaView style={styles.container}>
            <BackButtonHeader style={styles.header} />

            <View style={styles.mainImageWrapper}>
                <Image 
                   source={{ uri: GALLERY[selectedIndex] }} 
                   style={styles.mainImage}
                />
            </View>

            <View style={styles.thumbnailContainer}>
                {GALLERY.map((img, index) => {
                    const isActive = index === selectedIndex;
                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            onPress={() => setSelectedIndex(index)}
                        >
                            <Image 
                                source={{ uri: img }}
                                style={[
                                    styles.thumbnail,
                                    isActive ? styles.thumbnailActive : styles.thumbnailInactive
                                ]}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
};

export default Gallery;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA', // Matches the very light background in the mock
    },
    header: {
        marginBottom: mvs(25),
    },
    mainImageWrapper: {
        flex: 1,
        width: '100%',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    thumbnailContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: mvs(30),
        paddingHorizontal: ms(20),
    },
    thumbnail: {
        width: ms(58),
        height: ms(58),
        borderRadius: ms(12),
        marginHorizontal: ms(6),
        resizeMode: 'cover',
    },
    thumbnailActive: {
        opacity: 1,
    },
    thumbnailInactive: {
        opacity: 0.4,
    }
});
