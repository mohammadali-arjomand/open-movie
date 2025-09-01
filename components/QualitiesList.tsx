import { loadQualities } from "@/services/load-movie-data";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function QualitiesList({title, season, episode}: {title: string, season: string, episode: string}) {
  const [qualities, setQualities] = useState<{quality: string, language: string, url: string}[]>([]);
  useEffect(() => {
    loadQualities(title, season, episode).then(qualities => setQualities(qualities || []));
  }, [])
  

  return (
    <View>
        {qualities.length > 0 ? qualities.map(quality => (
            <TouchableOpacity key={quality.url} onPress={() => alert(quality.url)}>
               <Text style={styles.listItem}>{quality.quality} ({quality.language == 'sub' ? 'Subtitle' : (quality.language == 'dub' ? 'Dubbed' : 'Trailer')})</Text>
            </TouchableOpacity>
        )) : <Text>Loading...</Text>}
    </View>
  );
}

const styles = {
      listItem: {
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingVertical: 16,
    }
}