import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
    TextInput, 
    FlatList, 
    Text,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import Modal from 'react-native-modal';
import axios from 'axios';
import { COLORS, ICONS } from '../utils/constants';
import { ms, mvs } from '../utils/helper/metric';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LocationPickerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSelectLocation: (data: any, details: any) => void;
}

const GOOGLE_PLACES_API_KEY = 'AIzaSyCGRQavtVfIlnBuSkELe98R2MFjXQdnLRc'; // Provided by user

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ isVisible, onClose, onSelectLocation }) => {
    const [query, setQuery] = useState('');
    const [predictions, setPredictions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isVisible) {
            setQuery('');
            setPredictions([]);
            setIsLoading(false);
        }
    }, [isVisible]);

    useEffect(() => {
        const fetchPredictions = async () => {
            if (query.length < 2) {
                setPredictions([]);
                return;
            }

            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}`
                );
                
                if (response.data && response.data.predictions) {
                    setPredictions(response.data.predictions);
                } else {
                    setPredictions([]);
                }
            } catch (error) {
                console.log('Places API Error', error);
                setPredictions([]);
            }
        };

        const timeoutId = setTimeout(fetchPredictions, 500); // 500ms debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelectPlace = async (place: any) => {
        Keyboard.dismiss();
        setIsLoading(true);
        
        try {
            // Fetch Place Details to get latitude and longitude
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=geometry&key=${GOOGLE_PLACES_API_KEY}`
            );
            
            const details = response.data.result;
            
            onSelectLocation(place, details);
            onClose();
        } catch (error) {
            console.log('Places Details API Error', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isVisible={isVisible}
            style={styles.modal}
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={1}
            backdropColor={COLORS.white}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Image source={ICONS.back} style={styles.backIcon} resizeMode="contain" />
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Search location..."
                            placeholderTextColor={COLORS.gray}
                            value={query}
                            onChangeText={setQuery}
                            autoFocus
                        />
                        {query.length > 0 && (
                            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
                                <Text style={styles.clearText}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {isLoading && (
                    <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: mvs(20) }} />
                )}

                <FlatList
                    data={predictions}
                    keyExtractor={(item) => item.place_id}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.predictionItem} 
                            onPress={() => handleSelectPlace(item)}
                        >
                            <View style={styles.locationIconContainer}>
                                <Image source={ICONS.location} style={styles.locationIconSmall} resizeMode="contain" />
                            </View>
                            <View style={styles.predictionTextContainer}>
                                <Text style={styles.mainText} numberOfLines={1}>
                                    {item.structured_formatting?.main_text || item.description}
                                </Text>
                                <Text style={styles.secondaryText} numberOfLines={1}>
                                    {item.structured_formatting?.secondary_text || ''}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            </SafeAreaView>
        </Modal>
    );
};

export default LocationPickerModal;

const styles = StyleSheet.create({
    modal: {
        margin: 0,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingTop: mvs(10),
        paddingBottom: mvs(10),
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    closeBtn: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
    },
    backIcon: {
        width: ms(22),
        height: ms(22),
        tintColor: COLORS.black,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: ms(10),
        height: mvs(45),
        paddingHorizontal: ms(15),
    },
    textInput: {
        flex: 1,
        color: COLORS.black,
        fontSize: ms(14),
        height: '100%',
    },
    clearBtn: {
        padding: ms(5),
    },
    clearText: {
        color: COLORS.gray,
        fontSize: ms(14),
    },
    predictionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: mvs(15),
        paddingHorizontal: ms(20),
    },
    locationIconContainer: {
        width: ms(36),
        height: ms(36),
        borderRadius: ms(18),
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(15),
    },
    locationIconSmall: {
        width: ms(18),
        height: ms(18),
        tintColor: COLORS.gray,
    },
    predictionTextContainer: {
        flex: 1,
    },
    mainText: {
        color: COLORS.black,
        fontSize: ms(16),
        fontWeight: '500',
        marginBottom: mvs(2),
    },
    secondaryText: {
        color: COLORS.gray,
        fontSize: ms(13),
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: ms(70),
    }
});
