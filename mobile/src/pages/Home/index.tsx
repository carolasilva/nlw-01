import React, { useState, useEffect } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios'

interface IBGEUFResponse {
  sigla: string,
  nome: string
}

interface IBGECityResponse {
  nome: string
}

interface SelectObject {
  label: string,
  value: string
}

const Home = () => {
  const [ufs, setUfs] = useState<SelectObject[]>([])
  const [cities, setCities] = useState<SelectObject[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
      const ufInitials = response.data.map(uf => {
        return {
          label: uf.nome,
          value: uf.sigla
        }
      })
      setUfs(ufInitials)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      return 
    }

    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => {
          return {
            label: city.nome,
            value: city.nome
          }
        })
        setCities(cityNames)
    })
  }, [selectedUf])

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      selectedCity,
      selectedUf
    })
  }

  function handleSelectedUf(uf: string) {
    setSelectedUf(uf)
  }

  function handleSelectedCity(city: string) {
    setSelectedCity(city)
  }

  return (
    <ImageBackground 
      source={require('../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}> 
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>
      <View style={styles.select}>
        <RNPickerSelect
          key='estado'
          onValueChange={(value) => handleSelectedUf(value)}
          items={ufs}
          style={pickerSelectStyles}
          placeholder={{
            label: 'Selecione o estado',
            value: null,
            color: '#9EA0A4',
          }}
          useNativeAndroidPickerStyle={false}
          Icon={() => {
            return <Icon name="chevron-down" size={24} color="gray" />;
          }}
        />
        <RNPickerSelect
          key='cidade'
          onValueChange={(value) => handleSelectedCity(value)}
          items={cities}
          style={pickerSelectStyles}
          placeholder={{
            label: 'Selecione a cidade',
            value: null,
            color: '#9EA0A4',
          }}
          useNativeAndroidPickerStyle={false}
          Icon={() => {
            return <Icon name="chevron-down" size={24} color="gray" />;
          }}
        />
      </View>
      <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name='arrow-right' color='#FFF' size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {
    marginTop: 10
  },

  select: {
    marginTop: 10
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#FFF',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 12
  },
  inputAndroid: {
    backgroundColor: '#FFF',
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#FFF',
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 12
  },
  iconContainer: {
    top: 24,
    right: 12,
  }
});

export default Home;