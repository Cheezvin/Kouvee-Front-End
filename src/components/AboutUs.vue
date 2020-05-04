<template>
    <v-container>
     
        <v-img
            class=" mt-1 hidden-sm-and-down mb-4 mr-auto ml-auto"
            src="../assets/logokouvee.png"
            width="800"
            />
            <v-toolbar-title style="color: white;" class="text-center display-3 pb-5 mb-12">Tentang Kami</v-toolbar-title>   
            <v-card-text style="color:#f2a365;" class="display-2 text-center font-weight-black">Kouvee Petshop adalah toko hewan yang menyediakan berbagai macam kebutuhan hewan mulai dari makanan dan perawatannya.</v-card-text>
        
            <v-card-text style="color:#f2a365;" class="display-1 mt-12">Kami menyediakan berbagai macam makanan, mainan, vitamin, dan juga kandang bagi hewan-hewan tertentu</v-card-text>
            <v-img
            class=" mt-1 hidden-sm-and-down mb-4 ml-auto mr-12"
            src="../assets/produk.jpg"
            height="400"
            width="800"
            style="border-radius:500px;"
            />
            <v-card-text style="color:#f2a365;" class="display-1 text-right ">Kami juga dapat memberikan jasa layanan untuk merawat dan membersihkan hewan-hewan kesayangan anda</v-card-text>
             <v-img
            class=" mt-1 hidden-sm-and-down mb-4 ml-12"
            src="../assets/layanan.jpg"
            width="800"
            height="400"
            style="border-radius:500px;"
            />
            
            <v-card-text style="color:#f2a365;" class="display-2 text-center font-weight-black mt-12">Tunggu apa lagi ?</v-card-text>
            <v-card-text style="color:#f2a365;" class="display-1 text-center font-weight-black">Segera percayakan hewan kesayangan anda pada penanganan kami, Anda senang kami puas.</v-card-text>
           <v-card-text style="color:#f2a365;" class="title text-center font-weight-black"><v-icon color="#f2a365">mdi-phone</v-icon>: +62 812 3456 7890 </v-card-text>
               
    </v-container>
</template>

<script>

  export default {
    created() {
      this.$customerBar.value = true
    },
  }
</script>